import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import TrustBadge from "@/components/event/TrustBadge";
import EventCard from "@/components/event/EventCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import { formatMonthDay } from "@/lib/date";
import {
    getEventBySlugFromDb,
    getRelatedEventsFromDb,
} from "@/lib/db/events";
import { CalendarEvent } from "@/types/event";

interface EventDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const typeLabelMap: Record<CalendarEvent["type"], string> = {
    BIRTHDAY: "생일",
    ANNIVERSARY: "기념일",
    MEME: "밈",
    FANDOM: "팬덤",
    HISTORY: "역사",
    BRAND: "브랜드",
};

const typeEmojiMap: Record<CalendarEvent["type"], string> = {
    BIRTHDAY: "🎂",
    ANNIVERSARY: "🎉",
    MEME: "🔥",
    FANDOM: "💜",
    HISTORY: "📚",
    BRAND: "📢",
};

const categoryLabelMap: Record<CalendarEvent["category"], string> = {
    celebrity: "유명인",
    influencer: "인플루언서",
    kpop: "K-POP",
    meme: "밈",
    anniversary: "기념일",
    history: "역사",
    brand: "브랜드",
};

const sourceTypeLabelMap: Record<
    CalendarEvent["sources"][number]["type"],
    string
> = {
    official: "공식",
    news: "기사",
    wiki: "위키",
    community: "커뮤니티",
    sns: "SNS",
};

export const revalidate = 60;

export async function generateMetadata({
                                           params,
                                       }: EventDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlugFromDb(slug);

    if (!event) {
        return {
            title: "소재를 찾을 수 없습니다 - 오늘뭐올리지",
        };
    }

    return {
        title: `${event.title} - 오늘뭐올리지`,
        description: event.description,
        openGraph: {
            title: `${event.title} - 오늘뭐올리지`,
            description: event.description,
            type: "article",
        },
    };
}

export default async function EventDetailPage({
                                                  params,
                                              }: EventDetailPageProps) {
    const { slug } = await params;

    const [event, relatedEvents] = await Promise.all([
        getEventBySlugFromDb(slug),
        getRelatedEventsFromDb(slug),
    ]);

    if (!event) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="border-b border-gray-100 bg-white">
                <Container className="py-10 md:py-14">
                    <Link
                        href="/"
                        className="mb-8 inline-flex text-sm font-semibold text-gray-500 hover:text-black"
                    >
                        ← 오늘 소재로 돌아가기
                    </Link>

                    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                        <div>
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                  {typeEmojiMap[event.type]} {typeLabelMap[event.type]}
                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                  {categoryLabelMap[event.category]}
                </span>

                                <TrustBadge trustLevel={event.trustLevel} />
                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-gray-950 md:text-5xl">
                                {event.title}
                            </h1>

                            <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
                                {event.description}
                            </p>
                        </div>

                        <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                            <p className="mb-2 text-sm font-semibold text-gray-500">
                                날짜 정보
                            </p>

                            <p className="text-3xl font-black text-gray-950">
                                {formatMonthDay(event.month, event.day)}
                            </p>

                            {event.year && (
                                <p className="mt-2 text-sm text-gray-500">
                                    기준 연도: {event.year}년
                                </p>
                            )}

                            <div className="mt-5 flex flex-wrap gap-2">
                                {event.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-white px-3 py-1.5 text-xs text-gray-500 ring-1 ring-gray-200"
                                    >
                    #{tag}
                  </span>
                                ))}
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>

            <Container className="py-10 md:py-14">
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-semibold text-gray-500">
                                콘텐츠 아이디어
                            </p>

                            <h2 className="mb-4 text-2xl font-bold text-gray-950">
                                오늘 이렇게 활용해보세요
                            </h2>

                            <p className="text-base leading-7 text-gray-700">
                                {event.contentIdea}
                            </p>

                            <div className="mt-6 grid gap-3 md:grid-cols-3">
                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="mb-2 text-sm font-bold text-gray-950">
                                        짧은 영상
                                    </p>
                                    <p className="text-sm leading-6 text-gray-600">
                                        {formatMonthDay(event.month, event.day)}와 관련된 포인트를
                                        짧게 요약해 릴스, 쇼츠, 틱톡용 영상으로 풀기 좋아요.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="mb-2 text-sm font-bold text-gray-950">
                                        피드 / 블로그
                                    </p>
                                    <p className="text-sm leading-6 text-gray-600">
                                        날짜 의미와 배경, 관련 정보, 반응 포인트를 묶어서
                                        정보형 콘텐츠로 정리하기 좋습니다.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="mb-2 text-sm font-bold text-gray-950">
                                        스토리 / 커뮤니티
                                    </p>
                                    <p className="text-sm leading-6 text-gray-600">
                                        질문형 문구나 투표, 공감 유도 멘트를 붙이면 참여형
                                        콘텐츠로 활용하기 좋아요.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-semibold text-gray-500">
                                검증 정보
                            </p>

                            <h2 className="mb-4 text-2xl font-bold text-gray-950">
                                출처와 신뢰도
                            </h2>

                            {event.sources.length > 0 ? (
                                <div className="space-y-3">
                                    {event.sources.map((source) => (
                                        <a
                                            key={source.id}
                                            href={source.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="font-bold text-gray-950">
                                                        {source.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        출처 유형: {sourceTypeLabelMap[source.type]}
                                                    </p>
                                                </div>

                                                <span className="text-sm font-semibold text-gray-400">
                          열기 →
                        </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <p className="text-sm leading-6 text-gray-600">
                                        아직 등록된 출처가 부족합니다. 공개적으로 확인 가능한
                                        출처가 있다면 제보해주세요.
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-semibold text-gray-500">
                                운영 정책
                            </p>

                            <h2 className="mb-4 text-2xl font-bold text-gray-950">
                                이 정보는 이렇게 관리됩니다
                            </h2>

                            <div className="space-y-4 text-sm leading-6 text-gray-600">
                                <p>
                                    오늘뭐올리지는 공개적으로 확인 가능한 생일, 기념일, 밈,
                                    팬덤 이벤트 정보를 바탕으로 운영됩니다.
                                </p>
                                <p>
                                    비공개 개인정보, 추정 정보, 사적 정보는 등록하지 않는 것을
                                    원칙으로 합니다.
                                </p>
                                <p>
                                    밈이나 커뮤니티 이슈는 정확한 시작 시점이 불명확할 수 있어
                                    출처와 신뢰도 등급을 함께 표시합니다.
                                </p>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-black p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-white">
                                이 정보가 틀렸나요?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                날짜, 출처, 설명이 잘못되었거나 추가할 자료가 있다면 수정
                                제안을 보내주세요. 검수 후 반영됩니다.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/submit"
                                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-gray-100"
                                >
                                    수정 제안하기
                                </Link>

                                <Link
                                    href="/submit"
                                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
                                >
                                    출처 추가하기
                                </Link>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="mb-4 text-sm font-semibold text-gray-500">
                                빠른 요약
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400">분류</p>
                                    <p className="mt-1 font-bold text-gray-950">
                                        {typeLabelMap[event.type]}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">카테고리</p>
                                    <p className="mt-1 font-bold text-gray-950">
                                        {categoryLabelMap[event.category]}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">신뢰도</p>
                                    <div className="mt-2">
                                        <TrustBadge trustLevel={event.trustLevel} />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">출처 수</p>
                                    <p className="mt-1 font-bold text-gray-950">
                                        {event.sources.length}개
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="mb-4 text-sm font-semibold text-gray-500">
                                추천 문구
                            </p>

                            <div className="space-y-3">
                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="text-sm leading-6 text-gray-700">
                                        오늘은 {event.title}! 이 날짜에 맞춰 어떤 콘텐츠를 올리면
                                        좋을지 같이 떠올려봐요.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="text-sm leading-6 text-gray-700">
                                        {formatMonthDay(event.month, event.day)}에 활용하기 좋은
                                        콘텐츠 소재로 {event.title}를 소개해볼 수 있어요.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="mb-4 text-sm font-semibold text-gray-500">
                                Sponsored
                            </p>
                            <AdPlaceholder label="상세 페이지 광고 영역" size="rectangle" />
                        </section>
                    </aside>
                </div>

                <section className="mt-12">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-950">
                            함께 보기 좋은 소재
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            같은 날 또는 함께 참고하기 좋은 다른 소재들입니다.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {relatedEvents.map((relatedEvent) => (
                            <EventCard key={relatedEvent.id} event={relatedEvent} />
                        ))}
                    </div>
                </section>
            </Container>
        </main>
    );
}