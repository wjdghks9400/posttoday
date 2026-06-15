import type { EventCategory, EventType } from "@prisma/client";
import type { CalendarEvent, SourceType } from "@/types/event";

export const eventTypeOptions = [
    { label: "생일", value: "BIRTHDAY" },
    { label: "기념일", value: "ANNIVERSARY" },
    { label: "밈", value: "MEME" },
    { label: "팬덤 이벤트", value: "FANDOM" },
    { label: "브랜드 이벤트", value: "BRAND" },
    { label: "역사/사건", value: "HISTORY" },
] as const;

export const eventCategoryOptions = [
    { label: "연예인", value: "CELEBRITY" },
    { label: "인플루언서", value: "INFLUENCER" },
    { label: "K-POP", value: "KPOP" },
    { label: "e스포츠", value: "ESPORTS" },
    { label: "게임", value: "GAME" },
    { label: "애니/만화", value: "ANIME" },
    { label: "밈", value: "MEME" },
    { label: "브랜드", value: "BRAND" },
    { label: "역사", value: "HISTORY" },
    { label: "기타", value: "ETC" },
] as const;

export const eventTypeLabelMap: Record<EventType, string> = {
    BIRTHDAY: "생일",
    ANNIVERSARY: "기념일",
    MEME: "밈",
    FANDOM: "팬덤 이벤트",
    HISTORY: "역사/사건",
    BRAND: "브랜드 이벤트",
};

export const eventTypeEmojiMap: Record<EventType, string> = {
    BIRTHDAY: "🎂",
    ANNIVERSARY: "🎉",
    MEME: "🔥",
    FANDOM: "💜",
    HISTORY: "📚",
    BRAND: "📢",
};

export const eventCategoryLabelMap: Record<EventCategory, string> = {
    CELEBRITY: "연예인",
    INFLUENCER: "인플루언서",
    KPOP: "K-POP",
    ESPORTS: "e스포츠",
    GAME: "게임",
    ANIME: "애니/만화",
    MEME: "밈",
    BRAND: "브랜드",
    HISTORY: "역사",
    ETC: "기타",
};

export const calendarEventCategoryLabelMap: Record<CalendarEvent["category"], string> = {
    celebrity: "연예인",
    influencer: "인플루언서",
    kpop: "K-POP",
    esports: "e스포츠",
    game: "게임",
    anime: "애니/만화",
    meme: "밈",
    brand: "브랜드",
    history: "역사",
    etc: "기타",
};

const calendarCategoryByPrismaCategory: Record<EventCategory, CalendarEvent["category"]> = {
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

const calendarCategoryValues = new Set<CalendarEvent["category"]>([
    "celebrity",
    "influencer",
    "kpop",
    "esports",
    "game",
    "anime",
    "meme",
    "brand",
    "history",
    "etc",
]);

const sourceTypeValues = new Set<SourceType>([
    "official",
    "news",
    "wiki",
    "community",
    "sns",
]);

export function normalizeCalendarEventCategory(
    category: string | null | undefined
): CalendarEvent["category"] {
    if (!category) {
        return "etc";
    }

    const upperCategory = category.toUpperCase() as EventCategory;

    if (calendarCategoryByPrismaCategory[upperCategory]) {
        return calendarCategoryByPrismaCategory[upperCategory];
    }

    const lowerCategory = category.toLowerCase() as CalendarEvent["category"];

    if (calendarCategoryValues.has(lowerCategory)) {
        return lowerCategory;
    }

    return "etc";
}

export function normalizeCalendarSourceType(
    sourceType: string | null | undefined
): SourceType {
    const lowerSourceType = String(sourceType ?? "").toLowerCase() as SourceType;

    if (sourceTypeValues.has(lowerSourceType)) {
        return lowerSourceType;
    }

    return "community";
}

export function getCalendarEventCategoryLabel(
    category: string | null | undefined
) {
    return calendarEventCategoryLabelMap[normalizeCalendarEventCategory(category)];
}

export function getEventTypeLabel(type: string | null | undefined) {
    const key = String(type ?? "").toUpperCase() as EventType;

    return eventTypeLabelMap[key] ?? "이벤트";
}

export function getEventTypeEmoji(type: string | null | undefined) {
    const key = String(type ?? "").toUpperCase() as EventType;

    return eventTypeEmojiMap[key] ?? "📌";
}

export function getPrismaEventCategoryLabel(category: string | null | undefined) {
    const key = String(category ?? "").toUpperCase() as EventCategory;

    return eventCategoryLabelMap[key] ?? "기타";
}
