import { prisma } from "@/lib/prisma";

const typeLabelMap = {
    NEW_EVENT: "신규 제보",
    EDIT_REQUEST: "수정 제안",
    SOURCE_ADD: "출처 추가",
    REPORT: "신고",
} as const;

const statusLabelMap = {
    PENDING: "승인 대기",
    APPROVED: "승인 완료",
    REJECTED: "반려",
    NEED_MORE: "추가 확인",
} as const;

export async function getSubmissionsFromDb() {
    const submissions = await prisma.submission.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return submissions.map((submission) => ({
        id: submission.id,
        title: submission.title,
        category: submission.category ?? "-",
        date:
            submission.month && submission.day
                ? `${submission.month}월 ${submission.day}일`
                : "-",
        sourceUrl: submission.sourceUrl ?? "-",
        description: submission.description,
        type: typeLabelMap[submission.type],
        status: submission.status,
        statusLabel: statusLabelMap[submission.status],
        createdAt: submission.createdAt.toISOString().slice(0, 10),
        adminNote: submission.adminNote ?? "",
    }));
}