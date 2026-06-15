import { EventCategory, EventType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeCalendarEventCategory, normalizeCalendarSourceType } from "@/lib/event-options";

const eventTypes = [
    "BIRTHDAY",
    "ANNIVERSARY",
    "MEME",
    "FANDOM",
    "HISTORY",
    "BRAND",
] as const;

const eventCategories = [
    "CELEBRITY",
    "INFLUENCER",
    "KPOP",
    "ESPORTS",
    "GAME",
    "ANIME",
    "MEME",
    "BRAND",
    "HISTORY",
    "ETC",
] as const;

export interface SearchEventsParams {
    query?: string;
    type?: string;
    category?: string;
}

function normalizeParam(value?: string) {
    return value?.trim().toUpperCase() ?? "";
}

function isEventType(value: string): value is EventType {
    return eventTypes.includes(value as EventType);
}

function isEventCategory(value: string): value is EventCategory {
    return eventCategories.includes(value as EventCategory);
}

export async function searchEvents({
                                       query = "",
                                       type = "",
                                       category = "",
                                   }: SearchEventsParams) {
    const keyword = query.trim();
    const normalizedType = normalizeParam(type);
    const normalizedCategory = normalizeParam(category);

    const andConditions: Prisma.EventWhereInput[] = [];

    if (keyword) {
        andConditions.push({
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
        });
    }

    if (isEventType(normalizedType)) {
        andConditions.push({
            type: normalizedType,
        });
    }

    if (isEventCategory(normalizedCategory)) {
        andConditions.push({
            category: normalizedCategory,
        });
    }

    const events = await prisma.event.findMany({
        where: {
            status: "PUBLISHED",
            ...(andConditions.length > 0
                ? {
                    AND: andConditions,
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
        orderBy: [
            {
                month: "asc",
            },
            {
                day: "asc",
            },
            {
                title: "asc",
            },
        ],
    });

    return events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        month: event.month,
        day: event.day,
        year: event.year ?? undefined,
        type: event.type,
        category: normalizeCalendarEventCategory(event.category),
        description: event.description,
        contentIdea: event.contentIdea ?? "",
        trustLevel: event.trustLevel,
        tags: event.tags.map((item) => item.tag.name),
        sources: event.sources.map((source) => ({
            id: source.id,
            title: source.title,
            url: source.url,
            type: normalizeCalendarSourceType(source.type),
            verified: source.verified,
        })),
    }));
}