import { prisma } from "@/lib/prisma";
import { CalendarEvent } from "@/types/event";
import { Prisma } from "@prisma/client";
import { normalizeCalendarEventCategory, normalizeCalendarSourceType } from "@/lib/event-options";

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
        category: normalizeCalendarEventCategory(event.category),
        description: event.description,
        contentIdea: event.contentIdea ?? "",
        trustLevel: event.trustLevel as CalendarEvent["trustLevel"],
        tags: event.tags.map((item) => item.tag.name),
        sources: event.sources.map((source) => ({
            id: source.id,
            title: source.title,
            url: source.url,
            type: normalizeCalendarSourceType(source.type),
            verified: source.verified,
        })),
    };
}

function getDayOfYear(month: number, day: number) {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return monthDays.slice(0, month - 1).reduce((sum, value) => sum + value, 0) + day;
}

function getDistanceFromToday(
    event: PrismaEventWithRelations,
    month: number,
    day: number
) {
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

    const todayEvents = await prisma.event.findMany({
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
    });

    const allEvents = await prisma.event.findMany({
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
    });

    const total = await prisma.event.count({
        where: {
            status: "PUBLISHED",
        },
    });

    const trustCounts = await prisma.event.groupBy({
        by: ["trustLevel"],
        where: {
            status: "PUBLISHED",
        },
        _count: {
            _all: true,
        },
    });

    const pending = await prisma.submission.count({
        where: {
            status: "PENDING",
        },
    });

    const official =
        trustCounts.find((item) => item.trustLevel === "OFFICIAL")?._count._all ?? 0;
    const community =
        trustCounts.find((item) => item.trustLevel === "COMMUNITY")?._count._all ?? 0;

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
