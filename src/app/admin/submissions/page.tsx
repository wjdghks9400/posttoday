import Link from "next/link";
import Container from "@/components/layout/Container";
import SubmissionActionButtons from "@/components/admin/SubmissionActionButtons";
import {
    getSubmissionCounts,
    getSubmissionsFromDb,
    SubmissionFilter,
} from "@/lib/db/submissions";
import {
    eventCategoryLabelMap,
    eventTypeLabelMap,
} from "@/lib/event-options";
import { formatMonthDay } from "@/lib/date";

interface AdminSubmissionsPageProps {
    searchParams?: Promise<{
        status?: string;
    }>;
}

export const dynamic = "force-dynamic";

const statusLabelMap: Record<string, string> = {
    PENDING: "승인 대기",
    NEED_MORE: "보류",
    APPROVED: "승인됨",
    REJECTED: "반려됨",
};

const statusClassMap: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    NEED_MORE: "bg-blue-50 text-blue-700 ring-blue-600/20",
    APPROVED: "bg-green-50 text-green-700 ring-green-600/20",
    REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
};

const submissionTypeLabelMap: Record<string, string> = {
    NEW_EVENT: "신규 제보",
    EDIT_REQUEST: "수정 제안",
    SOURCE_ADD: "출처 추가",
    REPORT: "신고",
};

function parseFilter(value?: string): SubmissionFilter {
    if (value === "all") return "all";
    if (value === "pending") return "pending";
    if (value === "need_more") return "need_more";
    if (value === "approved") return "approved";
    if (value === "rejected") return "rejected";

    return "active";
}

function parseDescription(description: string) {
    const match = description.match(
        /^\[분류:(BIRTHDAY|ANNIVERSARY|MEME|FANDOM|HISTORY|BRAND)]\s*/
    );

    if (!match) {
        return {
            eventType: "ANNIVERSARY",
            cleanDescription: description,
        };
    }

    return {
        eventType: match[1],
        cleanDescription: description.replace(match[0], "").trim(),
    };
}

function getFilterHref(filter: SubmissionFilter) {
    if (filter === "active") return "/admin/submissions";
    return `/admin/submissions?status=${filter}`;
}

function FilterTab({
                       label,
                       count,
                       filter,
                       currentFilter,
                   }: {
    label: string;
    count: number;
    filter: SubmissionFilter;
    currentFilter: SubmissionFilter;
}) {
    const active = filter === currentFilter;

    return (
        <Link
            href={getFilterHref(filter)}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition ${
                active
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
        >
            <span>{label}</span>
            <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
            >
                {count}
            </span>
        </Link>
    );
}

export default async function AdminSubmissionsPage({
                                                       searchParams,
                                                   }: AdminSubmissionsPageProps) {
    const resolvedSearchParams = await searchParams;
    const currentFilter = parseFilter(resolvedSearchParams?.status);

    const [submissions, counts] = await Promise.all([
        getSubmissionsFromDb(currentFilter),
        getSubmissionCounts(),
    ]);

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-500">
                            Admin / Submissions
                        </p>

                        <h1 className="text-3xl font-black text-gray-950">제보 검수</h1>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            신규 제보, 수정 제안, 출처 추가 요청을 검수합니다. 수정
                            제안은 승인해도 자동 반영되지 않고, 관리자가 대상 항목을
                            직접 수정합니다.
                        </p>
                    </div>

                    <Link href="/admin/events" className="btn-secondary">
                        소재 관리로 이동
                    </Link>
                </div>

                <section className="mb-6 flex flex-wrap gap-2">
                    <FilterTab
                        label="검수 필요"
                        count={counts.active}
                        filter="active"
                        currentFilter={currentFilter}
                    />
                    <FilterTab
                        label="승인 대기"
                        count={counts.pending}
                        filter="pending"
                        currentFilter={currentFilter}
                    />
                    <FilterTab
                        label="보류"
                        count={counts.needMore}
                        filter="need_more"
                        currentFilter={currentFilter}
                    />
                    <FilterTab
                        label="승인됨"
                        count={counts.approved}
                        filter="approved"
                        currentFilter={currentFilter}
                    />
                    <FilterTab
                        label="반려됨"
                        count={counts.rejected}
                        filter="rejected"
                        currentFilter={currentFilter}
                    />
                    <FilterTab
                        label="전체"
                        count={counts.total}
                        filter="all"
                        currentFilter={currentFilter}
                    />
                </section>

                <section className="space-y-4">
                    {submissions.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
                            <p className="text-sm font-bold text-gray-500">
                                표시할 제보가 없습니다.
                            </p>
                        </div>
                    ) : (
                        submissions.map((submission) => {
                            const parsed = parseDescription(submission.description);

                            const categoryLabel = submission.category
                                ? eventCategoryLabelMap[
                                submission.category as keyof typeof eventCategoryLabelMap
                                ] ?? submission.category
                                : "미지정";

                            const eventTypeLabel =
                                eventTypeLabelMap[
                                    parsed.eventType as keyof typeof eventTypeLabelMap
                                    ] ?? parsed.eventType;

                            const targetEventSlug = submission.targetEvent?.slug ?? null;

                            return (
                                <article
                                    key={submission.id}
                                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                                >
                                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                                        <div>
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                    {submissionTypeLabelMap[submission.type] ??
                                                        submission.type}
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                                                        statusClassMap[submission.status] ??
                                                        "bg-gray-100 text-gray-600 ring-gray-500/20"
                                                    }`}
                                                >
                                                    {statusLabelMap[submission.status] ??
                                                        submission.status}
                                                </span>

                                                {submission.month && submission.day && (
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                                        {formatMonthDay(
                                                            submission.month,
                                                            submission.day
                                                        )}
                                                    </span>
                                                )}

                                                {targetEventSlug && (
                                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-600/20">
                                                        대상 항목 연결됨
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="text-xl font-black text-gray-950">
                                                {submission.title}
                                            </h2>

                                            <div className="mt-3 grid gap-2 text-sm text-gray-500 md:grid-cols-2">
                                                <p>
                                                    <span className="font-bold text-gray-700">
                                                        분류:
                                                    </span>{" "}
                                                    {eventTypeLabel}
                                                </p>
                                                <p>
                                                    <span className="font-bold text-gray-700">
                                                        분야:
                                                    </span>{" "}
                                                    {categoryLabel}
                                                </p>
                                            </div>

                                            <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                                                <p className="mb-2 text-xs font-bold text-gray-400">
                                                    제안 내용
                                                </p>
                                                <p className="max-w-3xl whitespace-pre-line text-sm leading-6 text-gray-600">
                                                    {parsed.cleanDescription}
                                                </p>
                                            </div>

                                            {submission.sourceUrl && (
                                                <a
                                                    href={submission.sourceUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-4 block break-all text-sm font-semibold text-gray-500 hover:text-black"
                                                >
                                                    출처: {submission.sourceUrl}
                                                </a>
                                            )}

                                            {targetEventSlug && (
                                                <div className="mt-4">
                                                    <Link
                                                        href={`/admin/events/${targetEventSlug}`}
                                                        className="text-sm font-bold text-gray-950 underline underline-offset-4"
                                                    >
                                                        대상 항목 수정 화면 열기 →
                                                    </Link>
                                                </div>
                                            )}

                                            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
                                                <span>
                                                    접수일:{" "}
                                                    {submission.createdAt
                                                        .toISOString()
                                                        .slice(0, 10)}
                                                </span>

                                                {submission.submitterEmail && (
                                                    <span>
                                                        제보자: {submission.submitterEmail}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <SubmissionActionButtons
                                            submissionId={submission.id}
                                            status={submission.status}
                                            type={submission.type}
                                            targetEventSlug={targetEventSlug}
                                        />
                                    </div>
                                </article>
                            );
                        })
                    )}
                </section>
            </Container>
        </main>
    );
}