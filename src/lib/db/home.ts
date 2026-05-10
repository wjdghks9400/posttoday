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
        ESPORTS: "esports",
        GAME: "game",
        ANIME: "anime",
        MEME: "meme",
        BRAND: "brand",
        HISTORY: "history",
        ETC: "etc",
    };

    return categoryMap[category] ?? "etc";
}

function mapTrustLevel(trustLevel: string): CalendarEvent["trustLevel"] {
    const trustLevelMap: Record<string, CalendarEvent["trustLevel"]> = {
        OFFICIAL: "OFFICIAL",
        SOURCE_VERIFIED: "SOURCE_VERIFIED",
        COMMUNITY: "COMMUNITY",
        UNCERTAIN: "UNCERTAIN",
    };

    return trustLevelMap[trustLevel] ?? "UNCERTAIN";
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

function getDayOfYear(month: number, day: number) {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return monthDays.slice(0, month - 1).reduce((sum, value) => sum + value, 0) + day;
}

function getDistanceFromToday(event: PrismaEventWithRelations, month: number, day: number) {
    const todayValue = getDayOfYear(month, day);
    const eventValue = getDayOfYear(event.month, event.day);

    if (eventValue >= todayValue) {
        return eventValue - todayValue;
    }

    return 365 - todayValue + eventValue;
}

export async function getHomeDataFromDb() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const [todayEvents, allEvents, total, official, community, pending] =
        await Promise.all([
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
                orderBy: [
                    {
                        type: "asc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
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
                take: 80,
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

    const upcomingEvents = allEvents
        .filter((event) => !(event.month === month && event.day === day))
        .sort((a, b) => {
            const aDistance = getDistanceFromToday(a, month, day);
            const bDistance = getDistanceFromToday(b, month, day);

            if (aDistance !== bDistance) {
                return aDistance - bDistance;
            }

            return a.title.localeCompare(b.title);
        })
        .slice(0, 9);

    const recentEvents = allEvents.slice(0, 6);

    return {
        todayEvents: todayEvents.map(mapEvent),
        upcomingEvents: upcomingEvents.map(mapEvent),
        recentEvents: recentEvents.map(mapEvent),
        stats: {
            total,
            official,
            community,
            pending,
        },
    };
}