import { prisma } from "@/lib/prisma";
import { CalendarEvent } from "@/types/event";
import { Prisma } from "@prisma/client";

type PrismaEventWithRelations = Prisma.EventGetPayload<{
    include: {
        sources: true;
        tags: {
            include: {
                tag: true;
            };
        };
    };
}>;

function mapEvent(event: PrismaEventWithRelations): CalendarEvent {
    return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        month: event.month,
        day: event.day,
        year: event.year ?? undefined,
        type: event.type as CalendarEvent["type"],
        category: event.category.toLowerCase() as CalendarEvent["category"],
        description: event.description,
        contentIdea: event.contentIdea ?? "",
        trustLevel: event.trustLevel as CalendarEvent["trustLevel"],
        tags: event.tags.map((item) => item.tag.name),
        sources: event.sources.map((source) => ({
            id: source.id,
            title: source.title,
            url: source.url,
            type: source.type.toLowerCase() as CalendarEvent["sources"][number]["type"],
            verified: source.verified,
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

    const currentEvent = await prisma.event.findFirst({
        where: {
            slug: {
                in: slugCandidates,
            },
        },
        select: {
            month: true,
            day: true,
            category: true,
        },
    });

    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            slug: {
                notIn: slugCandidates,
            },
            ...(currentEvent
                ? {
                    OR: [
                        {
                            month: currentEvent.month,
                            day: currentEvent.day,
                        },
                        {
                            category: currentEvent.category,
                        },
                    ],
                }
                : {}),
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