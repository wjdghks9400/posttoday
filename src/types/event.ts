export type CalendarEventType =
    | "BIRTHDAY"
    | "ANNIVERSARY"
    | "MEME"
    | "FANDOM"
    | "HISTORY"
    | "BRAND";

export type CalendarEventCategory =
    | "celebrity"
    | "influencer"
    | "kpop"
    | "esports"
    | "game"
    | "anime"
    | "meme"
    | "brand"
    | "history"
    | "etc";

export type TrustLevel =
    | "OFFICIAL"
    | "SOURCE_VERIFIED"
    | "COMMUNITY"
    | "UNCERTAIN";

export type SourceType = "official" | "news" | "wiki" | "community" | "sns";

export interface CalendarEventSource {
    id: string;
    title: string;
    url: string;
    type: SourceType;
}

export interface CalendarEvent {
    id: string;
    title: string;
    slug: string;
    month: number;
    day: number;
    year?: number;
    type: CalendarEventType;
    category: CalendarEventCategory;
    description: string;
    contentIdea: string;
    trustLevel: TrustLevel;
    tags: string[];
    sources: CalendarEventSource[];
}