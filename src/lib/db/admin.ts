import { prisma } from "@/lib/prisma";

export async function getAdminDashboardStats() {
    const [events, pendingSubmissions] = await Promise.all([
        prisma.event.findMany({
            where: {
                status: "PUBLISHED",
            },
            select: {
                trustLevel: true,
            },
        }),
        prisma.submission.count({
            where: {
                status: "PENDING",
            },
        }),
    ]);

    return {
        totalEvents: events.length,
        officialEvents: events.filter((event) => event.trustLevel === "OFFICIAL")
            .length,
        communityEvents: events.filter((event) => event.trustLevel === "COMMUNITY")
            .length,
        pendingSubmissions,
    };
}