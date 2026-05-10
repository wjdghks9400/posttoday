import { prisma } from "@/lib/prisma";

export type SubmissionFilter =
    | "active"
    | "all"
    | "pending"
    | "need_more"
    | "approved"
    | "rejected";

export async function getSubmissionsFromDb(filter: SubmissionFilter = "active") {
    const where =
        filter === "active"
            ? {
                status: {
                    in: ["PENDING", "NEED_MORE"] as const,
                },
            }
            : filter === "pending"
                ? {
                    status: "PENDING" as const,
                }
                : filter === "need_more"
                    ? {
                        status: "NEED_MORE" as const,
                    }
                    : filter === "approved"
                        ? {
                            status: "APPROVED" as const,
                        }
                        : filter === "rejected"
                            ? {
                                status: "REJECTED" as const,
                            }
                            : {};

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