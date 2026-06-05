import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import EventList from "@/components/event/EventList";
import SearchBox from "@/components/search/SearchBox";
import { searchEvents } from "@/lib/db/search";
import { CalendarEvent } from "@/types/event";
import {
    eventCategoryLabelMap,
    eventTypeLabelMap,
} from "@/lib/event-options";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        type?: string;
        category?: string;
    }>;
}

export const metadata: Metadata = {
    title: "생일·기념일 검색",
    description:
        "인물명, 날짜, 기념일, K-POP, 게임, 애니, 브랜드 키워드로 생일과 기념일 정보를 검색하세요.",
    alternates: {
        canonical: "/search",
    },
    openGraph: {
        title: "생일·기념일 검색 | TodayLab",
        description:
            "인물명, 날짜, 기념일, K-POP, 게임, 애니, 브랜드 키워드로 생일과 기념일 정보를 검색하세요.",
        url: "/search",
        type: "website",
    },
};

function normalizeEvents(events: Awaited<ReturnType<typeof searchEvents>>): CalendarEvent[] {
    return events.map((event) => ({
        ...event,
        type: event.type as CalendarEvent["type"],
        category: event.category as CalendarEvent["category"],
        trustLevel: event.trustLevel as CalendarEvent["trustLevel"],
        sources: event.sources.map((source) => ({
            ...source,
            type: source.type as CalendarEvent["sources"][number]["type"],
        })),
    }));
}

function getTypeLabel(type?: string) {
    if (!type) {
        return "전체";
    }

    const key = type.toUpperCase() as keyof typeof eventTypeLabelMap;

    return eventTypeLabelMap[key] ?? "전체";
}

function getCategoryLabel(category?: string) {
    if (!category) {
        return "전체 카테고리";
    }

    const key = category.toUpperCase() as keyof typeof eventCategoryLabelMap;

    return eventCategoryLabelMap[key] ?? "전체 카테고리";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const {
        q = "",
        type = "",
        category = "",
    } = await searchParams;

    const rawEvents = await searchEvents({
        query: q,
        type,
        category,
    });

    const events = normalizeEvents(rawEvents);

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <section className="mb-6">
                    <p className="mb-2 text-sm font-semibold text-gray-500">
                        Search
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-gray-950">
                        생일·기념일 검색
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        인물명, 날짜, 기념일, 사건, K-POP, 게임, 애니, 브랜드
                        키워드로 날짜 정보를 검색하세요.
                    </p>
                </section>

                <section aria-labelledby="search-form-title">
                    <h2 id="search-form-title" className="sr-only">
                        인물, 날짜, 기념일로 검색하기
                    </h2>

                    <SearchBox placeholder="인물, 생일, 기념일, 날짜, 게임, 애니 검색" />
                </section>

                <section className="mt-8" aria-labelledby="search-result-title">
                    <h2 id="search-result-title" className="sr-only">
                        생일·기념일 검색 결과
                    </h2>

                    <div className="mb-5 rounded-3xl bg-white p-5 text-sm text-gray-600 shadow-sm">
                        검색어:{" "}
                        <strong className="text-gray-950">{q || "전체"}</strong>{" "}
                        · 유형:{" "}
                        <strong className="text-gray-950">
                            {getTypeLabel(type)}
                        </strong>{" "}
                        · 카테고리:{" "}
                        <strong className="text-gray-950">
                            {getCategoryLabel(category)}
                        </strong>{" "}
                        · 결과:{" "}
                        <strong className="text-gray-950">{events.length}</strong>개
                    </div>

                    <EventList events={events} />
                </section>
            </Container>
        </main>
    );
}