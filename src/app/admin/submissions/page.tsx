import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import SubmissionActionButtons from "@/components/admin/SubmissionActionButtons";
import { getSubmissionsFromDb } from "@/lib/db/submissions";

const statusClassMap = {
    PENDING: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    APPROVED: "bg-green-50 text-green-700 ring-green-600/20",
    REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
    NEED_MORE: "bg-blue-50 text-blue-700 ring-blue-600/20",
} as const;

export default async function AdminSubmissionsPage() {
    const submissions = await getSubmissionsFromDb();

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <SectionTitle
                    eyebrow="Admin / Submissions"
                    title="제보 검수"
                    description="사용자가 보낸 소재 제보를 확인하고 승인 여부를 판단하는 화면입니다."
                />

                {submissions.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-950">
                            아직 접수된 제보가 없습니다
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            /submit 페이지에서 테스트 제보를 하나 등록해보세요.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <article
                                key={submission.id}
                                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                    <div>
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {submission.type}
                      </span>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                    statusClassMap[submission.status]
                                                }`}
                                            >
                        {submission.statusLabel}
                      </span>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {submission.date}
                      </span>
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-950">
                                            {submission.title}
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                            {submission.description}
                                        </p>

                                        <div className="mt-3 space-y-1 text-xs text-gray-400">
                                            <p>카테고리: {submission.category}</p>
                                            <p>출처: {submission.sourceUrl}</p>
                                            <p>접수일: {submission.createdAt}</p>
                                        </div>
                                    </div>

                                    <SubmissionActionButtons submissionId={submission.id} />
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
}