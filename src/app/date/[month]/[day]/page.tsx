import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import EventList from "@/components/event/EventList";
import { getEventsByDateFromDb } from "@/lib/db/events";
import { isValidMonthDay } from "@/lib/date";

interface DatePageProps {
    params: Promise<{
        month: string;
        day: string;
    }>;
}

const SITE_NAME = "TodayLab";
const DEFAULT_SITE_URL = "https://todaylab.today";

function getSiteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

function toDateNumbers(month: string, day: string) {
    return {
        monthNumber: Number(month),
        dayNumber: Number(day),
    };
}

function getDateLabel(month: number, day: number) {
    return `${month}월 ${day}일`;
}

function getDatePageTitle(month: number, day: number) {
    const dateLabel = getDateLabel(month, day);

    return `${dateLabel} 생일인 사람·연예인·기념일`;
}

function getDatePageDescription(month: number, day: number) {
    const dateLabel = getDateLabel(month, day);

    return `${dateLabel} 생일인 사람, 연예인, 아이돌, 인플루언서와 같은 날짜의 기념일·역사 정보를 확인하세요.`;
}

function getBirthdayNames(events: Awaited<ReturnType<typeof getEventsByDateFromDb>>) {
    return events
        .filter((event) => event.type === "BIRTHDAY")
        .map((event) => event.title);
}

function getBirthdaySummary(month: number, day: number, names: string[]) {
    const dateLabel = getDateLabel(month, day);

    if (names.length === 0) {
        return `${dateLabel}에 등록된 생일 정보는 아직 없습니다.`;
    }

    if (names.length <= 3) {
        return `${dateLabel} 생일인 인물은 ${names.join(", ")}입니다.`;
    }

    return `${dateLabel} 생일인 인물은 ${names.slice(0, 3).join(", ")} 외 ${names.length - 3}명입니다.`;
}

export async function generateMetadata({
                                           params,
                                       }: DatePageProps): Promise<Metadata> {
    const { month, day } = await params;
    const { monthNumber, dayNumber } = toDateNumbers(month, day);

<<<<<<< HEAD
    if (!isValidMonthDay(monthNumber, dayNumber)) {
        return {
            title: `날짜 정보를 찾을 수 없습니다 | ${SITE_NAME}`,
        };
    }

    const title = getDatePageTitle(monthNumber, dayNumber);
    const description = getDatePageDescription(monthNumber, dayNumber);
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/date/${monthNumber}/${dayNumber}`;
=======
    const title = `${monthNumber}월 ${dayNumber}일 생일·사건·기념일`;
    const description = `${monthNumber}월 ${dayNumber}일 생일, 사건·사고, 기념일, 인터넷 이슈, 밈성 날짜를 모아둔 페이지.`;
>>>>>>> 7492808 (add advertise page and update ad layout)

    return {
        title,
        description,
        alternates: {
            canonical: `/date/${monthNumber}/${dayNumber}`,
        },
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            url: pageUrl,
            siteName: SITE_NAME,
            type: "website",
            locale: "ko_KR",
        },
        twitter: {
            card: "summary",
            title: `${title} | ${SITE_NAME}`,
            description,
        },
    };
}

export default async function DatePage({ params }: DatePageProps) {
    const { month, day } = await params;
    const { monthNumber, dayNumber } = toDateNumbers(month, day);

    if (!isValidMonthDay(monthNumber, dayNumber)) {
        notFound();
    }

    const events = await getEventsByDateFromDb(monthNumber, dayNumber);

    const birthdayEvents = events.filter((event) => event.type === "BIRTHDAY");
    const anniversaryEvents = events.filter(
        (event) => event.type === "ANNIVERSARY"
    );
    const historyEvents = events.filter((event) => event.type === "HISTORY");
    const memeEvents = events.filter((event) => event.type === "MEME");
    const otherEvents = events.filter(
        (event) =>
            event.type !== "BIRTHDAY" &&
            event.type !== "ANNIVERSARY" &&
            event.type !== "HISTORY" &&
            event.type !== "MEME"
    );

    const dateLabel = getDateLabel(monthNumber, dayNumber);
    const birthdayNames = getBirthdayNames(events);
    const birthdaySummary = getBirthdaySummary(
        monthNumber,
        dayNumber,
        birthdayNames
    );
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/date/${monthNumber}/${dayNumber}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
<<<<<<< HEAD
        name: getDatePageTitle(monthNumber, dayNumber),
        description: getDatePageDescription(monthNumber, dayNumber),
        url: pageUrl,
        inLanguage: "ko-KR",
=======
        name: `${monthNumber}월 ${dayNumber}일 생일·사건·기념일`,
        description: `${monthNumber}월 ${dayNumber}일에 걸려 있는 생일, 사건, 기념일, 인터넷 이슈를 모은 날짜별 기록 페이지.`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tadaylab.today"}/date/${monthNumber}/${dayNumber}`,
>>>>>>> 7492808 (add advertise page and update ad layout)
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: siteUrl,
        },
        about: [
            `${dateLabel} 생일`,
            `${dateLabel} 생일인 사람`,
            `${dateLabel} 생일인 연예인`,
            `${dateLabel} 기념일`,
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
                <Link
                    href="/calendar"
                    className="mb-8 inline-flex text-sm font-semibold text-gray-500 hover:text-black"
                >
                    ← 캘린더로 돌아가기
                </Link>

                <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm md:p-9">
                    <p className="mb-2 text-sm font-semibold text-gray-500">
                        Date Archive
                    </p>

<<<<<<< HEAD
                    <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
                        {dateLabel} 생일인 사람·연예인·기념일
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
                        {dateLabel} 생일인 사람, 연예인, 아이돌, 인플루언서와 같은
                        날짜의 기념일·역사 정보를 확인하세요.
=======
                    <h1 className="text-3xl font-black tracking-tight text-gray-950">
                        {monthNumber}월 {dayNumber}일 생일·사건·기념일
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        {monthNumber}월 {dayNumber}일에 걸려 있는 생일, 사건,
                        사고, 기념일, 인터넷 이슈, 밈성 날짜들.
>>>>>>> 7492808 (add advertise page and update ad layout)
                    </p>

                    <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                        <p className="text-sm font-bold text-gray-500">
                            빠른 답변
                        </p>

                        <p className="mt-2 text-lg font-black leading-8 text-gray-950">
                            {birthdaySummary}
                        </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-gray-100 p-4">
                            <p className="text-sm font-bold text-gray-500">
                                생일
                            </p>

                            <p className="mt-2 text-2xl font-black text-gray-950">
                                {birthdayEvents.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-4">
                            <p className="text-sm font-bold text-gray-500">
                                기념일
                            </p>

                            <p className="mt-2 text-2xl font-black text-gray-950">
                                {anniversaryEvents.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-4">
                            <p className="text-sm font-bold text-gray-500">
                                역사/사건
                            </p>

                            <p className="mt-2 text-2xl font-black text-gray-950">
                                {historyEvents.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-4">
                            <p className="text-sm font-bold text-gray-500">
                                기타
                            </p>

                            <p className="mt-2 text-2xl font-black text-gray-950">
                                {otherEvents.length}
                            </p>
                        </div>
                    </div>
                </section>

                {events.length > 0 ? (
                    <div className="space-y-10">
                        {birthdayEvents.length > 0 && (
                            <section>
<<<<<<< HEAD
                                <div className="mb-4">
                                    <h2 className="text-2xl font-black text-gray-950">
                                        {dateLabel} 생일인 사람
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {dateLabel}에 생일로 등록된 인물 정보입니다.
                                    </p>
                                </div>

=======
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 생일
                                </h2>
>>>>>>> 7492808 (add advertise page and update ad layout)
                                <EventList events={birthdayEvents} />
                            </section>
                        )}

                        {anniversaryEvents.length > 0 && (
                            <section>
                                <div className="mb-4">
                                    <h2 className="text-2xl font-black text-gray-950">
                                        {dateLabel} 기념일
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {dateLabel}에 등록된 기념일 정보입니다.
                                    </p>
                                </div>

                                <EventList events={anniversaryEvents} />
                            </section>
                        )}

                        {historyEvents.length > 0 && (
                            <section>
<<<<<<< HEAD
                                <div className="mb-4">
                                    <h2 className="text-2xl font-black text-gray-950">
                                        {dateLabel} 역사적 사건
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {dateLabel}에 등록된 역사·사건 정보입니다.
                                    </p>
                                </div>

=======
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 사건·사고
                                </h2>
>>>>>>> 7492808 (add advertise page and update ad layout)
                                <EventList events={historyEvents} />
                            </section>
                        )}

                        {memeEvents.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 밈·인터넷 이슈
                                </h2>
                                <EventList events={memeEvents} />
                            </section>
                        )}

                        {otherEvents.length > 0 && (
                            <section>
<<<<<<< HEAD
                                <div className="mb-4">
                                    <h2 className="text-2xl font-black text-gray-950">
                                        {dateLabel} 기타 날짜 정보
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {dateLabel}에 등록된 게임, 애니, 브랜드, 밈, 팬덤
                                        관련 날짜 정보입니다.
                                    </p>
                                </div>

=======
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 기타 기록
                                </h2>
>>>>>>> 7492808 (add advertise page and update ad layout)
                                <EventList events={otherEvents} />
                            </section>
                        )}
                    </div>
                ) : (
                    <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-950">
                            아직 이 날짜는 비어 있음
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            이 날짜의 생일, 사건, 기념일, 인터넷 이슈를 알고 있다면
                            제보해줘.
                        </p>

                        <Link
                            href="/submit"
                            className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
                        >
                            날짜 기록 제보하기
                        </Link>
                    </section>
                )}
            </Container>
        </main>
    );
}