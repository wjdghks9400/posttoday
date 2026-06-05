import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { getCalendarDaysFromDb } from "@/lib/db/events";

interface CalendarPageProps {
    searchParams: Promise<{
        year?: string;
        month?: string;
    }>;
}

export const revalidate = 60;

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

function getKoreaToday() {
    const formatter = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

    const parts = formatter.formatToParts(new Date());

    return {
        year: Number(parts.find((part) => part.type === "year")?.value),
        month: Number(parts.find((part) => part.type === "month")?.value),
        day: Number(parts.find((part) => part.type === "day")?.value),
    };
}

function toValidYear(value: string | undefined, fallbackYear: number) {
    const year = Number(value);

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
        return fallbackYear;
    }

    return year;
}

function toValidMonth(value: string | undefined, fallbackMonth: number) {
    const month = Number(value);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
        return fallbackMonth;
    }

    return month;
}

function getPrevMonth(year: number, month: number) {
    if (month === 1) {
        return {
            year: year - 1,
            month: 12,
        };
    }

    return {
        year,
        month: month - 1,
    };
}

function getNextMonth(year: number, month: number) {
    if (month === 12) {
        return {
            year: year + 1,
            month: 1,
        };
    }

    return {
        year,
        month: month + 1,
    };
}

function getCalendarHref(year: number, month: number) {
    return `/calendar?year=${year}&month=${month}`;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
    const params = await searchParams;
    const today = getKoreaToday();

    const year = toValidYear(params.year, today.year);
    const month = toValidMonth(params.month, today.month);

    const prev = getPrevMonth(year, month);
    const next = getNextMonth(year, month);

    const days = await getCalendarDaysFromDb(year, month);

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <section className="mb-6">
                    <p className="mb-2 text-sm font-semibold text-gray-500">
                        Birthday & Anniversary Calendar
                    </p>

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-950">
                                {year}년 {month}월 생일·기념일 캘린더
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                                {month}월 날짜별 생일, 기념일, 역사적 사건, K-POP, 게임,
                                애니, 브랜드 관련 날짜 정보를 확인하세요.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={getCalendarHref(prev.year, prev.month)}
                                aria-label="이전 달 보기"
                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:text-black"
                            >
                                ← 이전달
                            </Link>

                            <Link
                                href={getCalendarHref(today.year, today.month)}
                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:text-black"
                            >
                                오늘
                            </Link>

                            <Link
                                href={getCalendarHref(next.year, next.month)}
                                aria-label="다음 달 보기"
                                className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-4 text-sm font-bold !text-white transition hover:bg-gray-800 hover:!text-white"
                            >
                                다음달 →
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mb-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-12">
                        {Array.from({ length: 12 }, (_, index) => {
                            const targetMonth = index + 1;
                            const isActive = targetMonth === month;

                            return (
                                <Link
                                    key={targetMonth}
                                    href={getCalendarHref(year, targetMonth)}
                                    className={
                                        isActive
                                            ? "rounded-2xl bg-black px-3 py-3 text-center text-sm font-bold !text-white"
                                            : "rounded-2xl bg-gray-50 px-3 py-3 text-center text-sm font-bold text-gray-600 transition hover:bg-gray-100 hover:text-black"
                                    }
                                >
                                    {targetMonth}월
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section
                    aria-labelledby="monthly-calendar-title"
                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                    <div className="mb-5 flex items-center justify-between">
                        <h2
                            id="monthly-calendar-title"
                            className="text-xl font-black text-gray-950"
                        >
                            {year}년 {month}월
                        </h2>

                        <Link
                            href={`/date/${month}`}
                            className="text-sm font-bold text-gray-500 hover:text-black"
                        >
                            {month}월 전체 보기 →
                        </Link>
                    </div>

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
                        {days.map((item, index) => {
                            const isToday =
                                year === today.year &&
                                month === today.month &&
                                item.day === today.day;

                            return (
                                <div
                                    key={`${item.day}-${index}`}
                                    className={
                                        item.day
                                            ? "min-h-32 rounded-2xl border border-gray-100 bg-gray-50 p-3"
                                            : "min-h-32 rounded-2xl border border-gray-100 bg-white p-3"
                                    }
                                >
                                    {item.day && (
                                        <>
                                            <Link
                                                href={`/date/${month}/${item.day}`}
                                                aria-label={`${month}월 ${item.day}일 생일·기념일 보기`}
                                                className={
                                                    isToday
                                                        ? "inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black text-sm font-bold !text-white ring-1 ring-black hover:bg-gray-800 hover:!text-white"
                                                        : "inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-950 ring-1 ring-gray-200 hover:bg-black hover:!text-white"
                                                }
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
                                                    <Link
                                                        href={`/date/${month}/${item.day}`}
                                                        className="block text-xs font-bold text-gray-400 hover:text-black"
                                                    >
                                                        +{item.events.length - 3}개 더보기
                                                    </Link>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </Container>
        </main>
    );
}