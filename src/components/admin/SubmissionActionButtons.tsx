"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
    approveSubmission,
    deleteSubmission,
    holdSubmission,
    rejectSubmission,
} from "@/app/admin/submissions/actions";

interface SubmissionActionButtonsProps {
    submissionId: string;
    status: string;
    type: string;
    targetEventSlug?: string | null;
}

function SubmitButton({
                          children,
                          className,
                      }: {
    children: React.ReactNode;
    className: string;
}) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending} className={className}>
            {pending ? "처리 중..." : children}
        </button>
    );
}

export default function SubmissionActionButtons({
                                                    submissionId,
                                                    status,
                                                    type,
                                                    targetEventSlug,
                                                }: SubmissionActionButtonsProps) {
    const canReview = status === "PENDING" || status === "NEED_MORE";
    const canEditTarget =
        targetEventSlug &&
        (type === "EDIT_REQUEST" || type === "SOURCE_ADD" || type === "REPORT");

    if (!canReview) {
        return (
            <div className="flex flex-wrap items-center justify-end gap-2">
                {canEditTarget && (
                    <Link
                        href={`/admin/events/${targetEventSlug}`}
                        className="btn-secondary h-10 rounded-xl px-4"
                    >
                        대상 항목 수정
                    </Link>
                )}

                <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-500">
                    처리 완료
                </span>

                <form action={deleteSubmission}>
                    <input type="hidden" name="submissionId" value={submissionId} />
                    <SubmitButton className="inline-flex h-10 items-center justify-center rounded-xl bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50">
                        기록 삭제
                    </SubmitButton>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {canEditTarget && (
                <Link
                    href={`/admin/events/${targetEventSlug}`}
                    className="btn-secondary h-10 rounded-xl px-4"
                >
                    대상 항목 수정
                </Link>
            )}

            <form action={approveSubmission}>
                <input type="hidden" name="submissionId" value={submissionId} />
                <SubmitButton className="btn-primary h-10 rounded-xl px-4 disabled:bg-gray-400">
                    승인
                </SubmitButton>
            </form>

            {status === "PENDING" && (
                <form action={holdSubmission}>
                    <input type="hidden" name="submissionId" value={submissionId} />
                    <SubmitButton className="btn-soft h-10 rounded-xl px-4 disabled:bg-gray-200 disabled:text-gray-400">
                        보류
                    </SubmitButton>
                </form>
            )}

            <form action={rejectSubmission}>
                <input type="hidden" name="submissionId" value={submissionId} />
                <SubmitButton className="btn-soft h-10 rounded-xl px-4 disabled:bg-gray-200 disabled:text-gray-400">
                    반려
                </SubmitButton>
            </form>
        </div>
    );
}