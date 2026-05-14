import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import { getCalendarDaysFromDb } from "@/lib/db/events";

export const metadata: Metadata = {
    title: "이벤트 캘린더 - 오늘뭐올리지",
    description:
        "월간 달력으로 생일, 기념일, 밈, 팬덤 이벤트를 한눈에 확인하세요.",
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
                <SectionTitle
                    eyebrow="Calendar"
                    title={`${month}월 이벤트 캘린더`}
                    description="날짜별 생일, 기념일, 밈, 팬덤 이벤트를 월간 달력으로 확인하세요."
                />

                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
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
                </div>
            </Container>
        </main>
    );
}