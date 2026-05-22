import { prisma } from "@/lib/prisma";
import { Prisma, SubmissionStatus } from "@prisma/client";

export type SubmissionFilter =
    | "active"
    | "all"
    | "pending"
    | "need_more"
    | "approved"
    | "rejected";

function getSubmissionWhere(filter: SubmissionFilter): Prisma.SubmissionWhereInput {
    if (filter === "active") {
        return {
            status: {
                in: ["PENDING", "NEED_MORE"] satisfies SubmissionStatus[],
            },
        };
    }

    if (filter === "pending") {
        return {
            status: "PENDING",
        };
    }

    if (filter === "need_more") {
        return {
            status: "NEED_MORE",
        };
    }

    if (filter === "approved") {
        return {
            status: "APPROVED",
        };
    }

    if (filter === "rejected") {
        return {
            status: "REJECTED",
        };
    }

    return {};
}

export async function getSubmissionsFromDb(filter: SubmissionFilter = "active") {
    const where = getSubmissionWhere(filter);

    const submissions = await prisma.submission.findMany({
        where,
        orderBy: {
            createdAt: "desc",
        },
    });

    return Promise.all(
        submissions.map(async (submission) => {
            const targetEvent =
                submission.month && submission.day
                    ? await prisma.event.findFirst({
                        where: {
                            title: submission.title,
                            month: submission.month,
                            day: submission.day,
                        },
                        select: {
                            id: true,
                            slug: true,
                            title: true,
                        },
                    })
                    : null;

            return {
                ...submission,
                targetEvent,
            };
        })
    );
}

export async function getSubmissionCounts() {
    const [pending, needMore, approved, rejected, total] = await Promise.all([
        prisma.submission.count({
            where: {
                status: "PENDING",
            },
        }),
        prisma.submission.count({
            where: {
                status: "NEED_MORE",
            },
        }),
        prisma.submission.count({
            where: {
                status: "APPROVED",
            },
        }),
        prisma.submission.count({
            where: {
                status: "REJECTED",
            },
        }),
        prisma.submission.count(),
    ]);

    return {
        active: pending + needMore,
        pending,
        needMore,
        approved,
        rejected,
        total,
    };
}