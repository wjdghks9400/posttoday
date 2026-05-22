import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import EventCard from "@/components/event/EventCard";
import { getCalendarDaysFromDb } from "@/lib/db/events";

interface MonthPageProps {
    params: Promise<{
        month: string;
    }>;
}

function toMonthNumber(month: string) {
    return Number(month);
}

function isValidMonth(month: number) {
    return Number.isInteger(month) && month >= 1 && month <= 12;
}

export async function generateMetadata({
                                           params,
                                       }: MonthPageProps): Promise<Metadata> {
    const { month } = await params;
    const monthNumber = toMonthNumber(month);

    if (!isValidMonth(monthNumber)) {
        return {
            title: "생일·기념일 캘린더",
            description:
                "TadayLab에서 날짜별 생일, 기념일, 역사적 사건 정보를 검색하세요.",
        };
    }

    const title = `${monthNumber}월 생일·기념일`;
    const description = `${monthNumber}월의 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 관련 날짜 정보를 확인하세요.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/date/${monthNumber}`,
        },
        openGraph: {
            title: `${title} | TadayLab`,
            description,
            url: `/date/${monthNumber}`,
            type: "website",
        },
    };
}

export default async function MonthPage({ params }: MonthPageProps) {
    const { month } = await params;
    const monthNumber = toMonthNumber(month);

    if (!isValidMonth(monthNumber)) {
        notFound();
    }

    const today = new Date();
    const year = today.getFullYear();

    const days = await getCalendarDaysFromDb(year, monthNumber);
    const activeDays = days.filter((item) => item.day && item.events.length > 0);

    const allEvents = activeDays.flatMap((item) => item.events);
    const birthdayEvents = allEvents.filter((event) => event.type === "BIRTHDAY");
    const anniversaryEvents = allEvents.filter(
        (event) => event.type === "ANNIVERSARY"
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tadaylab.today";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${monthNumber}월 생일·기념일`,
        description: `${monthNumber}월의 생일, 기념일, 역사적 사건 정보를 모은 월별 컬렉션 페이지입니다.`,
        url: `${siteUrl}/date/${monthNumber}`,
        isPartOf: {
            "@type": "WebSite",
            name: "TadayLab",
            url: siteUrl,
        },
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

                <section className="mb-8">
                    <p className="mb-2 text-sm font-semibold text-gray-500">
                        Monthly Archive
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-gray-950">
                        {monthNumber}월 생일·기념일
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        {monthNumber}월의 생일, 기념일, 역사적 사건, K-POP, 게임,
                        애니, 브랜드 관련 날짜 정보를 날짜별로 확인하세요.
                    </p>
                </section>

                <section className="mb-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            전체 날짜 정보
                        </p>

                        <p className="mt-2 text-3xl font-black text-gray-950">
                            {allEvents.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            생일 정보
                        </p>

                        <p className="mt-2 text-3xl font-black text-gray-950">
                            {birthdayEvents.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            기념일 정보
                        </p>

                        <p className="mt-2 text-3xl font-black text-gray-950">
                            {anniversaryEvents.length}
                        </p>
                    </div>
                </section>

                {activeDays.length > 0 ? (
                    <div className="space-y-10">
                        {activeDays.map((item) => (
                            <section
                                key={item.day}
                                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-950">
                                            {monthNumber}월 {item.day}일 생일·기념일
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-gray-500">
                                            {monthNumber}월 {item.day}일에 해당하는 생일,
                                            기념일, 사건 정보를 확인하세요.
                                        </p>
                                    </div>

                                    <Link
                                        href={`/date/${monthNumber}/${item.day}`}
                                        className="text-sm font-bold text-gray-500 hover:text-black"
                                    >
                                        날짜 상세 보기 →
                                    </Link>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {item.events.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-950">
                            아직 {monthNumber}월에 등록된 생일·기념일 정보가 없습니다
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            이 달의 생일, 기념일, 역사적 사건을 알고 있다면 제보해주세요.
                        </p>

                        <Link
                            href="/submit"
                            className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
                        >
                            날짜 정보 제보하기
                        </Link>
                    </section>
                )}
            </Container>
        </main>
    );
}