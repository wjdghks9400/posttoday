export type EventType =
    | "BIRTHDAY"
    | "ANNIVERSARY"
    | "MEME"
    | "FANDOM"
    | "HISTORY"
    | "BRAND";

export type TrustLevel =
    | "OFFICIAL"
    | "SOURCE_VERIFIED"
    | "COMMUNITY"
    | "UNCERTAIN";

export type EventCategory =
    | "celebrity"
    | "influencer"
    | "kpop"
    | "meme"
    | "anniversary"
    | "history"
    | "brand";

export interface Source {
    id: string;
    title: string;
    url: string;
    type: "official" | "news" | "wiki" | "community" | "sns";
}

export interface CalendarEvent {
    id: string;
    title: string;
    slug: string;
    month: number;
    day: number;
    year?: number;
    type: EventType;
    category: EventCategory;
    description: string;
    contentIdea: string;
    trustLevel: TrustLevel;
    tags: string[];
    sources: Source[];
}