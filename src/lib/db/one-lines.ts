import { prisma } from "@/lib/prisma";

export interface EventOneLine {
    id: string;
    nickname: string | null;
    body: string;
    createdAt: Date;
}

export async function getOneLinesByEventId(eventId: string): Promise<EventOneLine[]> {
    return prisma.oneLine.findMany({
        where: {
            eventId,
            deletedAt: null,
        },
        select: {
            id: true,
            nickname: true,
            body: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });
}

export async function getAdminOneLines() {
    return prisma.oneLine.findMany({
        include: {
            event: {
                select: {
                    title: true,
                    slug: true,
                    month: true,
                    day: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 200,
    });
}
