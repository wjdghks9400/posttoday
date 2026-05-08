import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import EventAdminButtons from "@/components/admin/EventAdminButtons";
import { getAdminEventsFromDb } from "@/lib/db/admin-events";

const statusClassMap = {
    DRAFT: "bg-gray-50 text-gray-600 ring-gray-500/20",
    PUBLISHED: "bg-green-50 text-green-700 ring-green-600/20",
    HIDDEN: "bg-red-50 text-red-700 ring-red-600/20",
} as const;

export default async function AdminEventsPage() {
    const events = await getAdminEventsFromDb();

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <SectionTitle
                    eyebrow="Admin / Events"
                    title="등록 소재 관리"
                    description="현재 등록된 생일, 기념일, 밈, 팬덤 이벤트를 관리합니다."
                />

                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex justify-between gap-3">
                        <input
                            placeholder="소재 검색"
                            className="h-11 w-full max-w-sm rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                        />
                        <a
                            href="/submit"
                            className="inline-flex h-11 items-center rounded-2xl bg-black px-5 text-sm font-bold text-white"
                        >
                            새 소재 제보
                        </a>
                    </div>

                    <div className="space-y-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 p-4 md:flex-row md:items-center"
                            >
                                <div>
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {event.month}월 {event.day}일
                    </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                statusClassMap[event.status]
                                            }`}
                                        >
                      {event.statusLabel}
                    </span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {event.trustLabel}
                    </span>
                                    </div>

                                    <h2 className="font-bold text-gray-950">{event.title}</h2>
                                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                                        {event.description}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        출처 {event.sourceCount}개 · 태그 {event.tags.length}개
                                    </p>
                                </div>

                                <EventAdminButtons
                                    eventId={event.id}
                                    slug={event.slug}
                                    status={event.status}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </main>
    );
}