import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import EventList from "@/components/event/EventList";
import { getEventsByDateFromDb } from "@/lib/db/events";

interface DatePageProps {
    params: Promise<{
        month: string;
        day: string;
    }>;
}

export async function generateMetadata({
                                           params,
                                       }: DatePageProps): Promise<Metadata> {
    const { month, day } = await params;
    const monthNumber = Number(month);
    const dayNumber = Number(day);

    return {
        title: `${monthNumber}월 ${dayNumber}일 생일·기념일·콘텐츠 소재 - 오늘뭐올리지`,
        description: `${monthNumber}월 ${dayNumber}일에 활용하기 좋은 생일, 기념일, 밈, 팬덤 이벤트, 콘텐츠 소재를 확인해보세요.`,
        openGraph: {
            title: `${monthNumber}월 ${dayNumber}일 콘텐츠 소재`,
            description: `${monthNumber}월 ${dayNumber}일에 올리기 좋은 콘텐츠 소재를 모았습니다.`,
            type: "website",
        },
    };
}

export default async function DatePage({ params }: DatePageProps) {
    const { month, day } = await params;
    const monthNumber = Number(month);
    const dayNumber = Number(day);
    const events = await getEventsByDateFromDb(monthNumber, dayNumber);

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <Link
                    href="/calendar"
                    className="mb-8 inline-flex text-sm font-semibold text-gray-500 hover:text-black"
                >
                    ← 캘린더로 돌아가기
                </Link>

                <SectionTitle
                    eyebrow="Date Archive"
                    title={`${monthNumber}월 ${dayNumber}일 콘텐츠 소재`}
                    description="이 날짜에 활용하기 좋은 생일, 기념일, 밈, 팬덤 이벤트를 모았습니다."
                />

                <EventList events={events} />

                {events.length === 0 && (
                    <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-950">
                            아직 등록된 소재가 없습니다
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            이 날짜에 어울리는 생일, 기념일, 밈을 알고 있다면 제보해주세요.
                        </p>
                        <Link
                            href="/submit"
                            className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
                        >
                            소재 제보하기
                        </Link>
                    </div>
                )}
            </Container>
        </main>
    );
}