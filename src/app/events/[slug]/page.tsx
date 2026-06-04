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
import {
    calendarEventCategoryLabelMap,
    eventTypeEmojiMap,
    eventTypeLabelMap,
} from "@/lib/event-options";
import { CalendarEvent } from "@/types/event";

interface EventDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const revalidate = 60;

const SITE_NAME = "TodayLab";
const DEFAULT_SITE_URL = "https://todaylab.today";

function safeDecodeSlug(slug: string) {
    try {
        return decodeURIComponent(slug);
    } catch {
        return slug;
    }
}

function getSiteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

function getEventPageTitle(event: CalendarEvent) {
    const dateLabel = formatMonthDay(event.month, event.day);

    if (event.type === "BIRTHDAY") {
        return `${event.title} 생일은 언제? ${dateLabel} 생일 정보`;
    }

    if (event.type === "ANNIVERSARY") {
        return `${event.title} 기념일은 언제? ${dateLabel} 기념일 정보`;
    }

    if (event.type === "HISTORY") {
        return `${event.title} - ${dateLabel} 역사 정보`;
    }

    return `${event.title} - ${dateLabel} 날짜 정보`;
}

function getEventMetaDescription(event: CalendarEvent) {
    const dateLabel = formatMonthDay(event.month, event.day);
    const categoryLabel = calendarEventCategoryLabelMap[event.category];
    const typeLabel = eventTypeLabelMap[event.type];

    if (event.type === "BIRTHDAY") {
        return `${event.title} 생일은 ${dateLabel}입니다. ${categoryLabel} 분야의 생일 정보와 공개 출처를 ${SITE_NAME}에서 확인하세요.`;
    }

    if (event.type === "ANNIVERSARY") {
        return `${event.title} 기념일은 ${dateLabel}입니다. ${categoryLabel} 분야의 기념일 정보와 공개 출처를 ${SITE_NAME}에서 확인하세요.`;
    }

    return `${event.title}의 날짜는 ${dateLabel}입니다. ${categoryLabel} 분야의 ${typeLabel} 정보를 ${SITE_NAME}에서 확인하세요.`;
}

function getDisplayTitle(event: CalendarEvent) {
    if (event.type === "BIRTHDAY") {
        return `${event.title} 생일`;
    }

    if (event.type === "ANNIVERSARY") {
        return `${event.title} 기념일`;
    }

    return event.title;
}

function getQuestionTitle(event: CalendarEvent) {
    if (event.type === "BIRTHDAY") {
        return `${event.title} 생일은 언제인가요?`;
    }

    if (event.type === "ANNIVERSARY") {
        return `${event.title} 기념일은 언제인가요?`;
    }

    return `${event.title} 날짜는 언제인가요?`;
}

function getAnswerText(event: CalendarEvent) {
    const dateLabel = formatMonthDay(event.month, event.day);

    if (event.type === "BIRTHDAY") {
        return `${event.title} 생일은 ${dateLabel}입니다.`;
    }

    if (event.type === "ANNIVERSARY") {
        return `${event.title} 기념일은 ${dateLabel}입니다.`;
    }

    return `${event.title}의 날짜는 ${dateLabel}입니다.`;
}

function getRelatedSectionTitle(event: CalendarEvent) {
    if (event.type === "BIRTHDAY") {
        return "같은 날짜의 다른 생일·기념일";
    }

    if (event.type === "ANNIVERSARY") {
        return "같은 날짜의 다른 기념일·생일";
    }

    return "같은 날짜의 다른 정보";
}

export async function generateMetadata({
                                           params,
                                       }: EventDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = safeDecodeSlug(slug);

    const event = await getEventBySlugFromDb(decodedSlug);

    if (!event) {
        return {
            title: `생일·기념일 정보 | ${SITE_NAME}`,
            description:
                "날짜별 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 관련 날짜 정보를 검색하세요.",
        };
    }

    const title = getEventPageTitle(event);
    const description = getEventMetaDescription(event);
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/events/${event.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: `/events/${event.slug}`,
        },
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            url: pageUrl,
            siteName: SITE_NAME,
            type: "article",
            locale: "ko_KR",
        },
        twitter: {
            card: "summary",
            title: `${title} | ${SITE_NAME}`,
            description,
        },
    };
}

export default async function EventDetailPage({
                                                  params,
                                              }: EventDetailPageProps) {
    const { slug } = await params;
    const decodedSlug = safeDecodeSlug(slug);

    const event = await getEventBySlugFromDb(decodedSlug);

    if (!event) {
        notFound();
    }

    const relatedEvents = await getRelatedEventsFromDb(decodedSlug);

    const dateLabel = formatMonthDay(event.month, event.day);
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/events/${event.slug}`;
    const displayTitle = getDisplayTitle(event);
    const questionTitle = getQuestionTitle(event);
    const answerText = getAnswerText(event);
    const categoryLabel = calendarEventCategoryLabelMap[event.category];
    const typeLabel = eventTypeLabelMap[event.type];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: getEventPageTitle(event),
        description: getEventMetaDescription(event),
        url: pageUrl,
        inLanguage: "ko-KR",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
        },
        about: [
            event.title,
            dateLabel,
            typeLabel,
            categoryLabel,
        ],
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
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

            <section className="border-b border-gray-100 bg-white">
                <Container className="py-10 md:py-14">
                    <Link
                        href={`/date/${event.month}/${event.day}`}
                        className="mb-8 inline-flex text-sm font-semibold text-gray-500 hover:text-black"
                    >
                        ← {dateLabel} 생일·기념일로 돌아가기
                    </Link>

                    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
                        <div>
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-bold text-gray-700">
                                    {eventTypeEmojiMap[event.type]} {typeLabel}
                                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-bold text-gray-700">
                                    {categoryLabel}
                                </span>

                                <TrustBadge trustLevel={event.trustLevel} />
                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-gray-950 md:text-5xl">
                                {displayTitle}
                            </h1>

                            <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
                                {answerText}
                            </p>

                            {event.description && (
                                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500 md:text-base">
                                    {event.description}
                                </p>
                            )}
                        </div>

                        <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                            <p className="mb-2 text-sm font-bold text-gray-500">
                                날짜 정보
                            </p>

                            <p className="text-3xl font-black text-gray-950">
                                {dateLabel}
                            </p>

                            {event.year && (
                                <p className="mt-2 text-sm text-gray-500">
                                    기준 연도: {event.year}년
                                </p>
                            )}

                            <Link
                                href={`/date/${event.month}/${event.day}`}
                                className="mt-5 inline-flex text-sm font-bold text-gray-950 hover:underline"
                            >
                                같은 날짜의 생일·기념일 보기 →
                            </Link>
                        </aside>
                    </div>
                </Container>
            </section>

            <Container className="py-10 md:py-14">
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-bold text-gray-500">
                                Answer
                            </p>

                            <h2 className="mb-4 text-2xl font-black text-gray-950">
                                {questionTitle}
                            </h2>

                            <p className="text-base leading-7 text-gray-700">
                                {answerText}
                            </p>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <p className="text-sm font-bold text-gray-500">
                                        이름
                                    </p>

                                    <p className="mt-2 text-lg font-black text-gray-950">
                                        {event.title}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <p className="text-sm font-bold text-gray-500">
                                        날짜
                                    </p>

                                    <p className="mt-2 text-lg font-black text-gray-950">
                                        {dateLabel}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <p className="text-sm font-bold text-gray-500">
                                        분류
                                    </p>

                                    <p className="mt-2 text-lg font-black text-gray-950">
                                        {typeLabel}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <p className="text-sm font-bold text-gray-500">
                                        분야
                                    </p>

                                    <p className="mt-2 text-lg font-black text-gray-950">
                                        {categoryLabel}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-bold text-gray-500">
                                Information
                            </p>

                            <h2 className="mb-5 text-2xl font-black text-gray-950">
                                {event.title} 관련 정보
                            </h2>

                            <p className="text-sm leading-7 text-gray-600">
                                {event.description}
                            </p>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-bold text-gray-500">
                                Sources
                            </p>

                            <h2 className="mb-5 text-2xl font-black text-gray-950">
                                {event.title} 출처
                            </h2>

                            {event.sources.length > 0 ? (
                                <div className="space-y-3">
                                    {event.sources.map((source, index) => (
                                        <a
                                            key={source.id}
                                            href={source.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-500">
                                                        출처 {index + 1}
                                                    </p>

                                                    <p className="mt-1 font-black text-gray-950">
                                                        {source.title}
                                                    </p>

                                                    <p className="mt-2 break-all text-sm leading-6 text-gray-500">
                                                        {source.url}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 text-sm font-bold text-gray-400">
                                                    열기 →
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <p className="text-sm leading-6 text-gray-600">
                                        아직 등록된 출처가 없습니다. 공개적으로 확인 가능한
                                        자료가 있다면 출처를 추가해주세요.
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-bold text-gray-500">
                                Image
                            </p>

                            <h2 className="mb-5 text-2xl font-black text-gray-950">
                                {event.title} 이미지
                            </h2>

                            <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                                <div>
                                    <p className="text-sm font-bold text-gray-500">
                                        아직 대표 이미지가 없습니다
                                    </p>

                                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                                        추후 관리자 화면에서 저작권 문제가 없는 이미지나
                                        직접 제작한 이미지를 등록하는 방식으로 확장할 수
                                        있습니다.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-2 text-sm font-bold text-gray-500">
                                Policy
                            </p>

                            <h2 className="mb-5 text-2xl font-black text-gray-950">
                                이 정보는 이렇게 관리됩니다
                            </h2>

                            <div className="space-y-4 text-sm leading-6 text-gray-600">
                                <p>
                                    {SITE_NAME}은 공개적으로 확인 가능한 생일, 기념일,
                                    역사적 사건, 출시일, 팬덤·브랜드 관련 날짜 정보를
                                    바탕으로 운영됩니다.
                                </p>

                                <p>
                                    비공개 개인정보, 추정 정보, 사적 정보는 등록하지 않는
                                    것을 원칙으로 합니다.
                                </p>

                                <p>
                                    사용자가 보낸 수정 제안과 출처 추가 요청은 관리자 검수
                                    후 반영됩니다.
                                </p>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-black p-6 shadow-sm">
                            <h2 className="text-2xl font-black text-white">
                                {event.title} 정보가 틀렸나요?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                날짜, 설명, 출처가 잘못되었거나 추가할 자료가 있다면
                                제보해주세요. 수정 제안은 자동 반영되지 않고, 관리자가
                                확인 후 별도로 수정합니다.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={`/events/${event.slug}/edit-request`}
                                    className="btn-secondary"
                                >
                                    수정 제안하기
                                </Link>

                                <Link
                                    href={`/events/${event.slug}/source-request`}
                                    className="btn-dark-outline"
                                >
                                    출처 추가하기
                                </Link>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-bold text-gray-500">
                                빠른 요약
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400">
                                        이름
                                    </p>

                                    <p className="mt-1 font-black text-gray-950">
                                        {event.title}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400">
                                        날짜
                                    </p>

                                    <p className="mt-1 font-black text-gray-950">
                                        {dateLabel}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400">
                                        분류
                                    </p>

                                    <p className="mt-1 font-black text-gray-950">
                                        {typeLabel}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400">
                                        분야
                                    </p>

                                    <p className="mt-1 font-black text-gray-950">
                                        {categoryLabel}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400">
                                        신뢰도
                                    </p>

                                    <div className="mt-2">
                                        <TrustBadge trustLevel={event.trustLevel} />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400">
                                        출처 수
                                    </p>

                                    <p className="mt-1 font-black text-gray-950">
                                        {event.sources.length}개
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="mb-4 text-sm font-bold text-gray-500">
                                Sponsored
                            </p>

                            <AdPlaceholder label="상세 페이지 광고 영역" size="rectangle" />
                        </section>
                    </aside>
                </div>

                {relatedEvents.length > 0 && (
                    <section className="mt-12">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-gray-950">
                                {getRelatedSectionTitle(event)}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {dateLabel}에 등록된 다른 날짜 정보를 함께 확인해보세요.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {relatedEvents.map((relatedEvent) => (
                                <EventCard key={relatedEvent.id} event={relatedEvent} />
                            ))}
                        </div>
                    </section>
                )}
            </Container>
        </main>
    );
}