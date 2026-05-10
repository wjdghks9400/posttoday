import { prisma } from "@/lib/prisma";

export async function getAdminEvents() {
    const events = await prisma.event.findMany({
        include: {
            sources: true,
        },
        orderBy: [
            {
                month: "asc",
            },
            {
                day: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    return events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        month: event.month,
        day: event.day,
        year: event.year,
        type: event.type,
        category: event.category,
        description: event.description,
        trustLevel: event.trustLevel,
        status: event.status,
        sourceCount: event.sources.length,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
    }));
}

export async function getAdminEventBySlug(slug: string) {
    return prisma.event.findUnique({
        where: {
            slug,
        },
        include: {
            sources: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
}