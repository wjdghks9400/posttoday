import Link from "next/link";
import Container from "@/components/layout/Container";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOneLines } from "@/lib/db/one-lines";
import { formatMonthDay } from "@/lib/date";
import { deleteOneLine } from "@/app/admin/one-lines/actions";

export const dynamic = "force-dynamic";

function formatCreatedAt(date: Date) {
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default async function AdminOneLinesPage() {
    await requireAdmin();

    const oneLines = await getAdminOneLines();
    const activeCount = oneLines.filter((oneLine) => !oneLine.deletedAt).length;
    const deletedCount = oneLines.filter((oneLine) => oneLine.deletedAt).length;

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-500">
                            Admin / One-line
                        </p>

                        <h1 className="text-3xl font-black text-gray-950">
                            한줄쓰기 관리
                        </h1>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            상세 페이지에 남겨진 한줄을 확인하고 광고·도배성 한줄을 삭제합니다.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin" className="btn-secondary">
                            대시보드
                        </Link>

                        <Link href="/admin/events" className="btn-secondary">
                            소재 관리
                        </Link>
                    </div>
                </div>

                <section className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">최근 한줄</p>
                        <p className="mt-3 text-3xl font-black text-gray-950">
                            {oneLines.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">노출 중</p>
                        <p className="mt-3 text-3xl font-black text-gray-950">
                            {activeCount}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">삭제됨</p>
                        <p className="mt-3 text-3xl font-black text-gray-950">
                            {deletedCount}
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-gray-950">
                            한줄 목록
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            최근 200개까지 표시됩니다. 삭제한 한줄은 사용자 화면에서 보이지 않습니다.
                        </p>
                    </div>

                    {oneLines.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-200 p-10 text-center">
                            <p className="text-sm font-semibold text-gray-500">
                                아직 등록된 한줄이 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {oneLines.map((oneLine) => (
                                <article
                                    key={oneLine.id}
                                    className={`rounded-3xl border p-5 shadow-sm ${
                                        oneLine.deletedAt
                                            ? "border-gray-100 bg-gray-50 opacity-60"
                                            : "border-gray-100 bg-white"
                                    }`}
                                >
                                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                                        <div>
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                    {formatMonthDay(oneLine.event.month, oneLine.event.day)}
                                                </span>

                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                    {oneLine.nickname || "익명"}
                                                </span>

                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                    {formatCreatedAt(oneLine.createdAt)}
                                                </span>

                                                {oneLine.deletedAt && (
                                                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                                                        삭제됨
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-base font-black text-gray-950">
                                                {oneLine.event.title}
                                            </h3>

                                            <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                                                {oneLine.body}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                                            <Link
                                                href={`/events/${oneLine.event.slug}`}
                                                className="btn-soft h-10 rounded-xl px-4"
                                            >
                                                보기
                                            </Link>

                                            {!oneLine.deletedAt && (
                                                <form action={deleteOneLine}>
                                                    <input
                                                        type="hidden"
                                                        name="oneLineId"
                                                        value={oneLine.id}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="slug"
                                                        value={oneLine.event.slug}
                                                    />

                                                    <button
                                                        type="submit"
                                                        className="h-10 rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100"
                                                    >
                                                        삭제
                                                    </button>
                                                </form>
                                            )}
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
