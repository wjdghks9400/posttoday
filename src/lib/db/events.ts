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

    const todayEvents = await getEventsByDateFromDb(month, day);

    if (todayEvents.length > 0) {
        return todayEvents;
    }

    const fallbackEvents = await prisma.event.findMany({
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
        take: 6,
    });

    return fallbackEvents.map(mapEvent);
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
    const event = await prisma.event.findUnique({
        where: {
            slug,
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

    if (!event || event.status !== "PUBLISHED") {
        return null;
    }

    return mapEvent(event);
}

export async function getRelatedEventsFromDb(
    currentSlug: string
): Promise<CalendarEvent[]> {
    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            slug: {
                not: currentSlug,
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
    });

    return events.map(mapEvent);
}

export async function getEventStatsFromDb() {
    const [total, official, community, pending] = await Promise.all([
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

    return {
        total,
        official,
        community,
        pending,
    };
}

export async function getCalendarDaysFromDb(year: number, month: number) {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);
    const firstDay = firstDate.getDay();
    const totalDays = lastDate.getDate();

    const monthEvents = await prisma.event.findMany({
        where: {
            month,
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
                day: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    const mappedEvents = monthEvents.map(mapEvent);

    const eventsByDay = new Map<number, CalendarEvent[]>();

    for (const event of mappedEvents) {
        const currentEvents = eventsByDay.get(event.day) ?? [];
        currentEvents.push(event);
        eventsByDay.set(event.day, currentEvents);
    }

    const days: Array<{
        day: number | null;
        events: CalendarEvent[];
    }> = [];

    for (let i = 0; i < firstDay; i += 1) {
        days.push({
            day: null,
            events: [],
        });
    }

    for (let day = 1; day <= totalDays; day += 1) {
        days.push({
            day,
            events: eventsByDay.get(day) ?? [],
        });
    }

    return days;
}