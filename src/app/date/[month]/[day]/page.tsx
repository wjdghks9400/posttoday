import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import EventList from "@/components/event/EventList";
import { getEventsByDateFromDb } from "@/lib/db/events";

interface DatePageProps {
    params: Promise<{
        month: string;
        day: string;
    }>;
}

function toDateNumbers(month: string, day: string) {
    return {
        monthNumber: Number(month),
        dayNumber: Number(day),
    };
}

export async function generateMetadata({
                                           params,
                                       }: DatePageProps): Promise<Metadata> {
    const { month, day } = await params;
    const { monthNumber, dayNumber } = toDateNumbers(month, day);

    const title = `${monthNumber}월 ${dayNumber}일 생일·기념일`;
    const description = `${monthNumber}월 ${dayNumber}일의 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 관련 날짜 정보를 확인하세요.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/date/${monthNumber}/${dayNumber}`,
        },
        openGraph: {
            title: `${title} | TadayLab`,
            description,
            url: `/date/${monthNumber}/${dayNumber}`,
            type: "website",
        },
    };
}

export default async function DatePage({ params }: DatePageProps) {
    const { month, day } = await params;
    const { monthNumber, dayNumber } = toDateNumbers(month, day);
    const events = await getEventsByDateFromDb(monthNumber, dayNumber);

    const birthdayEvents = events.filter((event) => event.type === "BIRTHDAY");
    const anniversaryEvents = events.filter(
        (event) => event.type === "ANNIVERSARY"
    );
    const historyEvents = events.filter((event) => event.type === "HISTORY");
    const otherEvents = events.filter(
        (event) =>
            event.type !== "BIRTHDAY" &&
            event.type !== "ANNIVERSARY" &&
            event.type !== "HISTORY"
    );

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${monthNumber}월 ${dayNumber}일 생일·기념일`,
        description: `${monthNumber}월 ${dayNumber}일의 생일, 기념일, 역사적 사건 정보를 모은 날짜별 컬렉션 페이지입니다.`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tadaylab.today"}/date/${monthNumber}/${dayNumber}`,
        isPartOf: {
            "@type": "WebSite",
            name: "TadayLab",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tadaylab.today",
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
                        Date Archive
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-gray-950">
                        {monthNumber}월 {dayNumber}일 생일·기념일
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        {monthNumber}월 {dayNumber}일의 생일, 기념일, 역사적 사건,
                        K-POP, 게임, 애니, 브랜드 관련 날짜 정보를 확인하세요.
                    </p>
                </section>

                {events.length > 0 ? (
                    <div className="space-y-10">
                        {birthdayEvents.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 생일인 인물
                                </h2>
                                <EventList events={birthdayEvents} />
                            </section>
                        )}

                        {anniversaryEvents.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 기념일
                                </h2>
                                <EventList events={anniversaryEvents} />
                            </section>
                        )}

                        {historyEvents.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 역사적 사건
                                </h2>
                                <EventList events={historyEvents} />
                            </section>
                        )}

                        {otherEvents.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-2xl font-black text-gray-950">
                                    {monthNumber}월 {dayNumber}일 게임·애니·브랜드 기념일
                                </h2>
                                <EventList events={otherEvents} />
                            </section>
                        )}
                    </div>
                ) : (
                    <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-950">
                            아직 등록된 생일·기념일 정보가 없습니다
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            이 날짜의 생일, 기념일, 역사적 사건을 알고 있다면
                            제보해주세요.
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