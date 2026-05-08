import { prisma } from "@/lib/prisma";
import { getPublishedEvents } from "@/lib/db/events";

export async function searchEvents(query: string, category: string) {
    const keyword = query.trim();

    if (!keyword && category === "전체 카테고리") {
        return getPublishedEvents();
    }

    const categoryMap: Record<string, string> = {
        생일: "CELEBRITY",
        기념일: "ANNIVERSARY",
        밈: "MEME",
        팬덤: "KPOP",
        브랜드: "BRAND",
        역사: "HISTORY",
    };

    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            AND: [
                keyword
                    ? {
                        OR: [
                            {
                                title: {
                                    contains: keyword,
                                    mode: "insensitive",
                                },
                            },
                            {
                                description: {
                                    contains: keyword,
                                    mode: "insensitive",
                                },
                            },
                            {
                                contentIdea: {
                                    contains: keyword,
                                    mode: "insensitive",
                                },
                            },
                            {
                                tags: {
                                    some: {
                                        tag: {
                                            name: {
                                                contains: keyword,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    }
                    : {},
                category !== "전체 카테고리" && categoryMap[category]
                    ? {
                        category: categoryMap[category] as never,
                    }
                    : {},
            ],
        },
        include: {
            sources: true,
            tags: {
                include: {
                    tag: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        month: event.month,
        day: event.day,
        year: event.year ?? undefined,
        type: event.type as never,
        category: event.category.toLowerCase() as never,
        description: event.description,
        contentIdea: event.contentIdea,
        trustLevel: event.trustLevel as never,
        tags: event.tags.map((item) => item.tag.name),
        sources: event.sources.map((source) => ({
            id: source.id,
            title: source.title,
            url: source.url,
            type: source.type.toLowerCase() as never,
        })),
    }));
}