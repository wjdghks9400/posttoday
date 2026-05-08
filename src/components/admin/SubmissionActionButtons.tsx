"use client";

import { useTransition } from "react";
import {
    approveSubmission,
    updateSubmissionStatus,
} from "@/app/admin/submissions/actions";

interface SubmissionActionButtonsProps {
    submissionId: string;
}

export default function SubmissionActionButtons({
                                                    submissionId,
                                                }: SubmissionActionButtonsProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex shrink-0 flex-wrap gap-2">
            <button
                disabled={isPending}
                onClick={() => {
                    startTransition(() => {
                        approveSubmission(submissionId);
                    });
                }}
                className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-white disabled:bg-gray-400"
            >
                승인
            </button>

            <button
                disabled={isPending}
                onClick={() => {
                    startTransition(() => {
                        updateSubmissionStatus(submissionId, "NEED_MORE");
                    });
                }}
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 disabled:text-gray-400"
            >
                보류
            </button>

            <button
                disabled={isPending}
                onClick={() => {
                    startTransition(() => {
                        updateSubmissionStatus(submissionId, "REJECTED");
                    });
                }}
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 disabled:text-gray-400"
            >
                반려
            </button>
        </div>
    );
}