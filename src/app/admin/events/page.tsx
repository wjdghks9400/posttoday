import Link from "next/link";
import Container from "@/components/layout/Container";
import TrustBadge from "@/components/event/TrustBadge";
import EventActionButtons from "@/components/admin/EventActionButtons";
import { getAdminEvents } from "@/lib/db/admin-events";
import { formatMonthDay } from "@/lib/date";

export const dynamic = "force-dynamic";

const eventTypeLabelMap: Record<string, string> = {
    BIRTHDAY: "생일",
    ANNIVERSARY: "기념일",
    MEME: "밈",
    FANDOM: "팬덤",
    HISTORY: "역사/사건",
    BRAND: "브랜드",
};

const eventTypeEmojiMap: Record<string, string> = {
    BIRTHDAY: "🎂",
    ANNIVERSARY: "🎉",
    MEME: "🔥",
    FANDOM: "💜",
    HISTORY: "📌",
    BRAND: "🏷️",
};

const eventCategoryLabelMap: Record<string, string> = {
    CELEBRITY: "연예인",
    INFLUENCER: "인플루언서",
    KPOP: "K-POP",
    ESPORTS: "e스포츠",
    GAME: "게임",
    ANIME: "애니",
    MEME: "밈",
    BRAND: "브랜드",
    HISTORY: "역사",
    ETC: "기타",
};

const statusLabelMap: Record<string, string> = {
    PUBLISHED: "공개",
    HIDDEN: "숨김",
    DRAFT: "초안",
};

const statusClassMap: Record<string, string> = {
    PUBLISHED: "bg-green-50 text-green-700 ring-green-600/20",
    HIDDEN: "bg-gray-100 text-gray-600 ring-gray-500/20",
    DRAFT: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
};

export default async function AdminEventsPage() {
    const events = await getAdminEvents();

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-500">
                            Admin / Events
                        </p>

                        <h1 className="text-3xl font-black text-gray-950">
                            등록 소재 관리
                        </h1>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            승인되어 등록된 생일, 사건, 역사, 밈, 팬덤 이벤트를 직접
                            수정합니다.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/submissions" className="btn-secondary">
                            제보 검수로 이동
                        </Link>

                        <Link href="/admin/one-lines" className="btn-secondary">
                            한줄쓰기 관리
                        </Link>

                        <Link href="/submit" className="btn-secondary">
                            사용자 제보 화면
                        </Link>
                    </div>
                </div>

                <section className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">전체 소재</p>
                        <p className="mt-3 text-3xl font-black text-gray-950">
                            {events.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">공개 소재</p>
                        <p className="mt-3 text-3xl font-black text-gray-950">
                            {events.filter((event) => event.status === "PUBLISHED").length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">숨김 소재</p>
                        <p className="mt-3 text-3xl font-black text-gray-950">
                            {events.filter((event) => event.status === "HIDDEN").length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">총 출처 수</p>
                        <p className="mt-3 text-3xl font-black text-gray-950">
                            {events.reduce((sum, event) => sum + event.sourceCount, 0)}
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-gray-950">소재 목록</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            신규 제보를 승인하면 이 목록에 등록됩니다. 이후 수정 버튼을
                            눌러 내용을 직접 다듬을 수 있습니다.
                        </p>
                    </div>

                    {events.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-200 p-10 text-center">
                            <p className="text-sm font-semibold text-gray-500">
                                아직 등록된 소재가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {events.map((event) => (
                                <article
                                    key={event.id}
                                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                                >
                                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                                        <div>
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                    {formatMonthDay(event.month, event.day)}
                                                </span>

                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                    {eventTypeEmojiMap[event.type] ?? "📌"}{" "}
                                                    {eventTypeLabelMap[event.type] ?? event.type}
                                                </span>

                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                    {eventCategoryLabelMap[event.category] ??
                                                        event.category}
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                                                        statusClassMap[event.status] ??
                                                        "bg-gray-100 text-gray-600 ring-gray-500/20"
                                                    }`}
                                                >
                                                    {statusLabelMap[event.status] ?? event.status}
                                                </span>

                                                <TrustBadge trustLevel={event.trustLevel} />
                                            </div>

                                            <h3 className="text-lg font-black text-gray-950">
                                                {event.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-500">
                                                {event.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                <span>출처 {event.sourceCount}개</span>
                                                <span>slug: {event.slug}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                                            <Link
                                                href={`/events/${event.slug}`}
                                                className="btn-soft h-10 rounded-xl px-4"
                                            >
                                                보기
                                            </Link>

                                            <Link
                                                href={`/admin/events/${event.slug}`}
                                                className="btn-primary h-10 rounded-xl px-4"
                                            >
                                                수정
                                            </Link>

                                            <EventActionButtons
                                                eventId={event.id}
                                                status={event.status}
                                            />
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </Container>
        </main>
    );
}