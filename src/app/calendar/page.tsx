import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { getCalendarDaysFromDb } from "@/lib/db/events";

export const metadata: Metadata = {
    title: "생일·기념일 캘린더",
    description:
        "월별 캘린더에서 날짜별 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 기념일을 확인하세요.",
    alternates: {
        canonical: "/calendar",
    },
    openGraph: {
        title: "생일·기념일 캘린더 | TadayLab",
        description:
            "날짜별 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 기념일을 월별 캘린더로 확인하세요.",
        url: "/calendar",
        type: "website",
    },
};

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default async function CalendarPage() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const days = await getCalendarDaysFromDb(year, month);

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <section className="mb-6">
                    <p className="mb-2 text-sm font-semibold text-gray-500">
                        Birthday & Anniversary Calendar
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-gray-950">
                        {month}월 생일·기념일 캘린더
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        {month}월 날짜별 생일, 기념일, 역사적 사건, K-POP, 게임,
                        애니, 브랜드 관련 날짜 정보를 확인하세요.
                    </p>
                </section>

                <section
                    aria-labelledby="monthly-calendar-title"
                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                    <h2 id="monthly-calendar-title" className="sr-only">
                        {month}월 날짜별 생일·기념일 목록
                    </h2>

                    <div className="mb-4 grid grid-cols-7 gap-2">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="rounded-2xl bg-gray-50 py-3 text-center text-sm font-bold text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {days.map((item, index) => (
                            <div
                                key={`${item.day}-${index}`}
                                className="min-h-32 rounded-2xl border border-gray-100 bg-gray-50 p-3"
                            >
                                {item.day && (
                                    <>
                                        <Link
                                            href={`/date/${month}/${item.day}`}
                                            aria-label={`${month}월 ${item.day}일 생일·기념일 보기`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-950 ring-1 ring-gray-200 hover:bg-black hover:text-white"
                                        >
                                            {item.day}
                                        </Link>

                                        <div className="mt-3 space-y-1">
                                            {item.events.slice(0, 3).map((event) => (
                                                <Link
                                                    key={event.id}
                                                    href={`/events/${event.slug}`}
                                                    className="block truncate rounded-lg bg-white px-2 py-1 text-xs text-gray-600 hover:text-black"
                                                >
                                                    {event.title}
                                                </Link>
                                            ))}

                                            {item.events.length > 3 && (
                                                <p className="text-xs text-gray-400">
                                                    +{item.events.length - 3}개 더보기
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </Container>
        </main>
    );
}