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

function getSlugCandidates(slug: string) {
    const candidates = new Set<string>();

    candidates.add(slug);

    try {
        candidates.add(decodeURIComponent(slug));
    } catch {
        // ignore
    }

    try {
        candidates.add(encodeURIComponent(slug));
    } catch {
        // ignore
    }

    return Array.from(candidates);
}

export async function getPublishedEvents(): Promise<CalendarEvent[]> {
    const events = await prisma.event.findMany({
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
            {
                createdAt: "desc",
            },
        ],
    });

    return events.map(mapEvent);
}

export async function getTodayEventsFromDb(): Promise<CalendarEvent[]> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            month,
            day,
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

    return events.map(mapEvent);
}

export async function getFeaturedEventsFromDb(): Promise<CalendarEvent[]> {
    const events = await prisma.event.findMany({
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
    });

    return events.map(mapEvent);
}

export async function getWeeklyEventsFromDb(): Promise<CalendarEvent[]> {
    const events = await prisma.event.findMany({
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
    });

    return events.map(mapEvent);
}

export async function getEventBySlugFromDb(
    slug: string
): Promise<CalendarEvent | null> {
    const slugCandidates = getSlugCandidates(slug);

    const event = await prisma.event.findFirst({
        where: {
            status: "PUBLISHED",
            slug: {
                in: slugCandidates,
            },
        },
        include: {
            sources: true,
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    if (!event) {
        return null;
    }

    return mapEvent(event);
}

export async function getRelatedEventsFromDb(
    currentSlug: string
): Promise<CalendarEvent[]> {
    const slugCandidates = getSlugCandidates(currentSlug);

    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            slug: {
                notIn: slugCandidates,
            },
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
    });

    return events.map(mapEvent);
}

export async function getEventsByDateFromDb(
    month: number,
    day: number
): Promise<CalendarEvent[]> {
    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            month,
            day,
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

    return events.map(mapEvent);
}

export async function getCalendarDaysFromDb(year: number, month: number) {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);

    const firstDayOfWeek = firstDate.getDay();
    const lastDay = lastDate.getDate();

    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            month,
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
            day: "asc",
        },
    });

    const mappedEvents = events.map(mapEvent);

    const days: {
        day: number | null;
        events: CalendarEvent[];
    }[] = [];

    for (let i = 0; i < firstDayOfWeek; i += 1) {
        days.push({
            day: null,
            events: [],
        });
    }

    for (let day = 1; day <= lastDay; day += 1) {
        days.push({
            day,
            events: mappedEvents.filter((event) => event.day === day),
        });
    }

    return days;
}

export async function getEventStatsFromDb() {
    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
        },
        select: {
            trustLevel: true,
        },
    });

    const pending = await prisma.submission.count({
        where: {
            status: "PENDING",
        },
    });

    return {
        total: events.length,
        official: events.filter((event) => event.trustLevel === "OFFICIAL").length,
        community: events.filter((event) => event.trustLevel === "COMMUNITY")
            .length,
        pending,
    };
}