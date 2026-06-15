import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import EventCard from "@/components/event/EventCard";
import { getPublishedEvents } from "@/lib/db/events";
import { formatMonthDay } from "@/lib/date";
import type { CalendarEvent } from "@/types/event";

const SITE_NAME = "TodayLab";
const DEFAULT_SITE_URL = "https://todaylab.today";

export const revalidate = 60;

export const metadata: Metadata = {
    title: `오늘의 생일 | ${SITE_NAME}`,
    description:
        "오늘 생일인 사람과 날짜별 생일 정보를 확인하세요. 연예인 생일, 아이돌 생일, K-POP 멤버 생일을 월별로 볼 수 있습니다.",
    alternates: {
        canonical: "/birthdays",
    },
    openGraph: {
        title: `오늘의 생일 | ${SITE_NAME}`,
        description:
            "오늘 생일인 사람과 날짜별 생일 정보를 확인하세요.",
        url: "/birthdays",
        siteName: SITE_NAME,
        type: "website",
        locale: "ko_KR",
    },
    twitter: {
        card: "summary",
        title: `오늘의 생일 | ${SITE_NAME}`,
        description:
            "오늘 생일인 사람과 날짜별 생일 정보를 확인하세요.",
    },
};

function getSiteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

function getKoreaToday() {
    const formatter = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        month: "numeric",
        day: "numeric",
    });

    const parts = formatter.formatToParts(new Date());

    const month = Number(parts.find((part) => part.type === "month")?.value);
    const day = Number(parts.find((part) => part.type === "day")?.value);

    return {
        month,
        day,
    };
}

function sortByDate(events: CalendarEvent[]) {
    return [...events].sort((a, b) => {
        if (a.month !== b.month) {
            return a.month - b.month;
        }

        if (a.day !== b.day) {
            return a.day - b.day;
        }

        return a.title.localeCompare(b.title, "ko");
    });
}

function getBirthdayEvents(events: CalendarEvent[]) {
    return sortByDate(events.filter((event) => event.type === "BIRTHDAY"));
}

function getTodayBirthdayEvents(events: CalendarEvent[]) {
    const today = getKoreaToday();

    return events.filter(
        (event) => event.month === today.month && event.day === today.day
    );
}

function getMonthlyCounts(events: CalendarEvent[]) {
    return Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;

        return {
            month,
            count: events.filter((event) => event.month === month).length,
        };
    });
}

function getCategoryCounts(events: CalendarEvent[]) {
    const targetCategories = [
        {
            category: "kpop",
            label: "K-POP",
        },
        {
            category: "celebrity",
            label: "연예인",
        },
        {
            category: "influencer",
            label: "인플루언서",
        },
        {
            category: "anime",
            label: "애니/만화",
        },
        {
            category: "game",
            label: "게임",
        },
        {
            category: "esports",
            label: "e스포츠",
        },
    ] as const;

    return targetCategories.map((item) => ({
        category: item.category,
        label: item.label,
        count: events.filter(
            (event) => String(event.category) === item.category
        ).length,
    }));
}

function getBirthdaySummary(events: CalendarEvent[]) {
    if (events.length === 0) {
        return "아직 등록된 생일 정보가 없습니다.";
    }

    const previewNames = events.slice(0, 5).map((event) => event.title);

    if (events.length <= 5) {
        return `${previewNames.join(", ")}의 생일 정보가 등록되어 있습니다.`;
    }

    return `${previewNames.join(", ")} 외 ${events.length - 5}개의 생일 정보가 등록되어 있습니다.`;
}

export default async function BirthdaysPage() {
    const events = await getPublishedEvents();

    const birthdayEvents = getBirthdayEvents(events);
    const todayBirthdayEvents = getTodayBirthdayEvents(birthdayEvents);
    const monthlyCounts = getMonthlyCounts(birthdayEvents);
    const categoryCounts = getCategoryCounts(birthdayEvents);

    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/birthdays`;
    const today = getKoreaToday();
    const todayLabel = formatMonthDay(today.month, today.day);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "오늘의 생일",
        description:
            "오늘 생일인 사람과 날짜별 생일 정보를 확인할 수 있는 페이지입니다.",
        url: pageUrl,
        inLanguage: "ko-KR",
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: siteUrl,
        },
        about: [
            "오늘의 생일",
            "오늘 생일인 사람",
            "연예인 생일",
            "아이돌 생일",
            "K-POP 생일",
            "월별 생일",
        ],
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />

            <Container className="py-12">
                <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm md:p-10">
                    <p className="mb-2 text-sm font-bold text-gray-500">
                        Birthdays
                    </p>

                    <h1 className="text-4xl font-black tracking-tight text-gray-950 md:text-5xl">
                        오늘의 생일
                    </h1>

                    <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
                        {todayLabel}에 생일로 등록된 인물과 날짜별 생일 정보를
                        확인할 수 있습니다.
                    </p>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-gray-100 p-5">
                            <p className="text-sm font-bold text-gray-500">
                                오늘 날짜
                            </p>

                            <p className="mt-2 text-3xl font-black text-gray-950">
                                {todayLabel}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-5">
                            <p className="text-sm font-bold text-gray-500">
                                오늘 생일
                            </p>

                            <p className="mt-2 text-3xl font-black text-gray-950">
                                {todayBirthdayEvents.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-5">
                            <p className="text-sm font-bold text-gray-500">
                                전체 생일
                            </p>

                            <p className="mt-2 text-3xl font-black text-gray-950">
                                {birthdayEvents.length}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-2xl font-black text-gray-950">
                            {todayLabel} 생일
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            오늘 날짜에 생일로 등록된 인물 정보입니다.
                        </p>
                    </div>

                    {todayBirthdayEvents.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {todayBirthdayEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-gray-50 p-6">
                            <p className="text-sm leading-6 text-gray-600">
                                오늘 날짜에 등록된 생일 정보가 아직 없습니다.
                            </p>
                        </div>
                    )}
                </section>

                <section className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-2xl font-black text-gray-950">
                            월별 생일
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            월별로 등록된 생일 정보를 확인할 수 있습니다.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {monthlyCounts.map((item) => (
                            <Link
                                key={item.month}
                                href={`/date/${item.month}`}
                                className="rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
                            >
                                <p className="text-lg font-black text-gray-950">
                                    {item.month}월 생일
                                </p>

                                <p className="mt-2 text-sm font-semibold text-gray-500">
                                    등록 {item.count}개
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-2xl font-black text-gray-950">
                            분야별 생일
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            K-POP, 연예인, 인플루언서, 애니/만화, 게임 분야의 생일
                            정보를 확인할 수 있습니다.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {categoryCounts.map((item) => (
                            <Link
                                key={item.category}
                                href={`/search?type=BIRTHDAY&category=${item.category}`}
                                className="rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
                            >
                                <p className="text-lg font-black text-gray-950">
                                    {item.label} 생일
                                </p>

                                <p className="mt-2 text-sm font-semibold text-gray-500">
                                    등록 {item.count}개
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-gray-950">
                                전체 생일
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                현재 등록된 생일 정보를 날짜순으로 확인할 수 있습니다.
                            </p>
                        </div>

                        <Link
                            href="/search?type=BIRTHDAY"
                            className="text-sm font-bold text-gray-500 hover:text-black"
                        >
                            검색 페이지에서 보기 →
                        </Link>
                    </div>

                    {birthdayEvents.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {birthdayEvents.slice(0, 60).map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-gray-50 p-6">
                            <p className="text-sm leading-6 text-gray-600">
                                아직 등록된 생일 정보가 없습니다.
                            </p>
                        </div>
                    )}

                    {birthdayEvents.length > 60 && (
                        <div className="mt-8 text-center">
                            <Link
                                href="/search?type=BIRTHDAY"
                                className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-bold !text-white transition hover:bg-gray-800"
                            >
                                전체 생일 검색하기
                            </Link>
                        </div>
                    )}
                </section>
            </Container>
        </main>
    );
}