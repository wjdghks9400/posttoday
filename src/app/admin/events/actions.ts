"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isValidMonthDay } from "@/lib/date";
import { requireAdmin } from "@/lib/admin-auth";

import {
    EventCategory,
    EventStatus,
    EventType,
    SourceType,
    TrustLevel,
} from "@prisma/client";

const eventTypes: EventType[] = [
    "BIRTHDAY",
    "ANNIVERSARY",
    "MEME",
    "FANDOM",
    "HISTORY",
    "BRAND",
];

const eventCategories: EventCategory[] = [
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
];

const trustLevels: TrustLevel[] = [
    "OFFICIAL",
    "SOURCE_VERIFIED",
    "COMMUNITY",
    "UNCERTAIN",
];

const eventStatuses: EventStatus[] = ["DRAFT", "PUBLISHED", "HIDDEN"];

const sourceTypes: SourceType[] = [
    "OFFICIAL",
    "NEWS",
    "WIKI",
    "COMMUNITY",
    "SNS",
];

function toNumber(value: FormDataEntryValue | null) {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
        return null;
    }

    return numberValue;
}

function toOptionalNumber(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (!text) {
        return null;
    }

    const numberValue = Number(text);

    if (Number.isNaN(numberValue)) {
        return null;
    }

    return numberValue;
}

function toEventType(value: FormDataEntryValue | null): EventType {
    const text = String(value ?? "");

    if (eventTypes.includes(text as EventType)) {
        return text as EventType;
    }

    return "ANNIVERSARY";
}

function toEventCategory(value: FormDataEntryValue | null): EventCategory {
    const text = String(value ?? "");

    if (eventCategories.includes(text as EventCategory)) {
        return text as EventCategory;
    }

    return "ETC";
}

function toTrustLevel(value: FormDataEntryValue | null): TrustLevel {
    const text = String(value ?? "");

    if (trustLevels.includes(text as TrustLevel)) {
        return text as TrustLevel;
    }

    return "UNCERTAIN";
}

function toEventStatus(value: FormDataEntryValue | null): EventStatus {
    const text = String(value ?? "");

    if (eventStatuses.includes(text as EventStatus)) {
        return text as EventStatus;
    }

    return "PUBLISHED";
}

function toSourceType(value: FormDataEntryValue | null): SourceType {
    const text = String(value ?? "");

    if (sourceTypes.includes(text as SourceType)) {
        return text as SourceType;
    }

    return "COMMUNITY";
}

function getAdminEventRedirectUrl(slug?: string | null) {
    if (!slug) {
        return "/admin/events";
    }

    return `/admin/events/${encodeURIComponent(slug)}`;
}

function revalidateEventPaths(slug?: string | null) {
    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/search");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/admin/submissions");

    if (slug) {
        revalidatePath(`/events/${encodeURIComponent(slug)}`);
        revalidatePath(`/admin/events/${encodeURIComponent(slug)}`);
    }
}

export async function updateEvent(formData: FormData) {
    const eventId = String(formData.get("eventId") ?? "");
    const currentSlug = String(formData.get("currentSlug") ?? "");

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const month = toNumber(formData.get("month"));
    const day = toNumber(formData.get("day"));
    const year = toOptionalNumber(formData.get("year"));

    const type = toEventType(formData.get("type"));
    const category = toEventCategory(formData.get("category"));
    const trustLevel = toTrustLevel(formData.get("trustLevel"));
    const status = toEventStatus(formData.get("status"));

    const redirectUrl = getAdminEventRedirectUrl(currentSlug);

    if (!eventId) {
        redirect("/admin/events");
    }

    if (!title || !description || !month || !day) {
        redirect(redirectUrl);
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) {
        redirect(redirectUrl);
    }

    await prisma.event.update({
        where: {
            id: eventId,
        },
        data: {
            title,
            month,
            day,
            year,
            type,
            category,
            description,
            trustLevel,
            status,
        },
    });

    revalidateEventPaths(currentSlug);

    redirect(redirectUrl);
}

export async function addEventSource(formData: FormData) {
    const eventId = String(formData.get("eventId") ?? "");
    const currentSlug = String(formData.get("currentSlug") ?? "");

    const title = String(formData.get("sourceTitle") ?? "").trim();
    const url = String(formData.get("sourceUrl") ?? "").trim();
    const type = toSourceType(formData.get("sourceType"));
    const verified = formData.get("verified") === "on";

    const redirectUrl = getAdminEventRedirectUrl(currentSlug);

    if (!eventId) {
        redirect(redirectUrl);
    }

    if (!url) {
        redirect(redirectUrl);
    }

    const existingSource = await prisma.source.findFirst({
        where: {
            eventId,
            url,
        },
        select: {
            id: true,
        },
    });

    if (!existingSource) {
        await prisma.source.create({
            data: {
                eventId,
                title: title || "추가 출처",
                url,
                type,
                verified,
            },
        });
    }

    revalidateEventPaths(currentSlug);

    redirect(redirectUrl);
}

export async function deleteEventSource(formData: FormData) {
    const sourceId = String(formData.get("sourceId") ?? "");
    const currentSlug = String(formData.get("currentSlug") ?? "");

    const redirectUrl = getAdminEventRedirectUrl(currentSlug);

    if (!sourceId) {
        redirect(redirectUrl);
    }

    await prisma.source.deleteMany({
        where: {
            id: sourceId,
        },
    });

    revalidateEventPaths(currentSlug);

    redirect(redirectUrl);
}

export async function publishEvent(formData: FormData) {
    const eventId = String(formData.get("eventId") ?? "");

    if (!eventId) {
        redirect("/admin/events");
    }

    const event = await prisma.event.update({
        where: {
            id: eventId,
        },
        data: {
            status: "PUBLISHED",
        },
        select: {
            slug: true,
        },
    });

    revalidateEventPaths(event.slug);

    redirect("/admin/events");
}

export async function hideEvent(formData: FormData) {
    const eventId = String(formData.get("eventId") ?? "");

    if (!eventId) {
        redirect("/admin/events");
    }

    const event = await prisma.event.update({
        where: {
            id: eventId,
        },
        data: {
            status: "HIDDEN",
        },
        select: {
            slug: true,
        },
    });

    revalidateEventPaths(event.slug);

    redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
    const eventId = String(formData.get("eventId") ?? "");

    if (!eventId) {
        redirect("/admin/events");
    }

    const event = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
        select: {
            slug: true,
        },
    });

    await prisma.$transaction(async (tx) => {
        await tx.source.deleteMany({
            where: {
                eventId,
            },
        });

        await tx.eventTag.deleteMany({
            where: {
                eventId,
            },
        });

        await tx.event.deleteMany({
            where: {
                id: eventId,
            },
        });
    });

    revalidateEventPaths(event?.slug);

    redirect("/admin/events");
}