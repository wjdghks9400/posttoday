import { prisma } from "@/lib/prisma";
import { CalendarEvent } from "@/types/event";

type PrismaEventWithRelations = {
    id: string;
    title: string;
    slug: string;
    month: number;
    day: number;
    year: number | null;
    type: string;
    category: string;
    description: string;
    contentIdea: string;
    trustLevel: string;
    sources: {
        id: string;
        title: string;
        url: string;
        type: string;
    }[];
    tags: {
        tag: {
            name: string;
        };
    }[];
};

function mapEventType(type: string): CalendarEvent["type"] {
    return type as CalendarEvent["type"];
}

function mapCategory(category: string): CalendarEvent["category"] {
    const categoryMap: Record<string, CalendarEvent["category"]> = {
        CELEBRITY: "celebrity",
        INFLUENCER: "influencer",
        KPOP: "kpop",
        MEME: "meme",
        ANNIVERSARY: "anniversary",
        HISTORY: "history",
        BRAND: "brand",
    };

    return categoryMap[category] ?? "anniversary";
}

function mapTrustLevel(trustLevel: string): CalendarEvent["trustLevel"] {
    return trustLevel as CalendarEvent["trustLevel"];
}

function mapSourceType(
    sourceType: string
): CalendarEvent["sources"][number]["type"] {
    const sourceTypeMap: Record<string, CalendarEvent["sources"][number]["type"]> =
        {
            OFFICIAL: "official",
            NEWS: "news",
            WIKI: "wiki",
            COMMUNITY: "community",
            SNS: "sns",
        };

    return sourceTypeMap[sourceType] ?? "wiki";
}

function mapEvent(event: PrismaEventWithRelations): CalendarEvent {
    return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        month: event.month,
        day: event.day,
        year: event.year ?? undefined,
        type: mapEventType(event.type),
        category: mapCategory(event.category),
        description: event.description,
        contentIdea: event.contentIdea,
        trustLevel: mapTrustLevel(event.trustLevel),
        tags: event.tags.map((item) => item.tag.name),
        sources: event.sources.map((source) => ({
            id: source.id,
            title: source.title,
            url: source.url,
            type: mapSourceType(source.type),
        })),
    };
}

export async function getHomeDataFromDb() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const [
        todayEvents,
        featuredEvents,
        weeklyEvents,
        total,
        official,
        community,
        pending,
    ] = await Promise.all([
        prisma.event.findMany({
            where: {
                month,
                day,
                status: "PUBLISHED",
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
            take: 6,
        }),

        prisma.event.findMany({
            where: {
                status: "PUBLISHED",
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
            take: 3,
        }),

        prisma.event.findMany({
            where: {
                status: "PUBLISHED",
            },
            include: {
                sources: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
            orderBy: [
                {
                    month: "asc",
                },
                {
                    day: "asc",
                },
            ],
            take: 7,
        }),

        prisma.event.count({
            where: {
                status: "PUBLISHED",
            },
        }),

        prisma.event.count({
            where: {
                status: "PUBLISHED",
                trustLevel: "OFFICIAL",
            },
        }),

        prisma.event.count({
            where: {
                status: "PUBLISHED",
                trustLevel: "COMMUNITY",
            },
        }),

        prisma.submission.count({
            where: {
                status: "PENDING",
            },
        }),
    ]);

    let finalTodayEvents = todayEvents;

    if (finalTodayEvents.length === 0) {
        finalTodayEvents = weeklyEvents.slice(0, 6);
    }

    return {
        todayEvents: finalTodayEvents.map(mapEvent),
        featuredEvents: featuredEvents.map(mapEvent),
        weeklyEvents: weeklyEvents.map(mapEvent),
        stats: {
            total,
            official,
            community,
            pending,
        },
    };
}