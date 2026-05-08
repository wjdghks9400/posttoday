import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import EventList from "@/components/event/EventList";
import SearchBox from "@/components/search/SearchBox";
import { searchEvents } from "@/lib/db/search";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
    }>;
}

export const metadata: Metadata = {
    title: "콘텐츠 소재 검색 - 오늘뭐올리지",
    description:
        "생일, 기념일, 밈, 팬덤 이벤트를 검색하고 오늘 올릴 콘텐츠 소재를 찾아보세요.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "", category = "전체 카테고리" } = await searchParams;
    const events = await searchEvents(q, category);

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <SectionTitle
                    eyebrow="Search"
                    title="콘텐츠 소재 검색"
                    description="생일, 기념일, 밈, 팬덤 이벤트를 검색해보세요."
                />

                <SearchBox />

                <div className="mt-8">
                    <div className="mb-5 rounded-3xl bg-white p-5 text-sm text-gray-600 shadow-sm">
                        검색어: <strong className="text-gray-950">{q || "전체"}</strong> ·
                        카테고리:{" "}
                        <strong className="text-gray-950">{category || "전체"}</strong> ·
                        결과: <strong className="text-gray-950">{events.length}</strong>개
                    </div>

                    <EventList events={events} />
                </div>
            </Container>
        </main>
    );
}