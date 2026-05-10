"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EventCategory, EventType, SubmissionType } from "@prisma/client";

export interface SubmitState {
    ok: boolean;
    message: string;
}

function toNumberOrNull(value: FormDataEntryValue | null) {
    if (!value) return null;

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
        return null;
    }

    return numberValue;
}

function toEventType(value: string): EventType {
    const allowedTypes: EventType[] = [
        "BIRTHDAY",
        "ANNIVERSARY",
        "MEME",
        "FANDOM",
        "HISTORY",
        "BRAND",
    ];

    if (allowedTypes.includes(value as EventType)) {
        return value as EventType;
    }

    return "ANNIVERSARY";
}

function toEventCategory(value: string): EventCategory {
    const normalizedValue = value.trim().toUpperCase();

    const categoryMap: Record<string, EventCategory> = {
        CELEBRITY: "CELEBRITY",
        INFLUENCER: "INFLUENCER",
        KPOP: "KPOP",
        ESPORTS: "ESPORTS",
        GAME: "GAME",
        ANIME: "ANIME",
        MEME: "MEME",
        BRAND: "BRAND",
        HISTORY: "HISTORY",
        ETC: "ETC",

        celebrity: "CELEBRITY",
        influencer: "INFLUENCER",
        kpop: "KPOP",
        esports: "ESPORTS",
        game: "GAME",
        anime: "ANIME",
        meme: "MEME",
        brand: "BRAND",
        history: "HISTORY",
        etc: "ETC",
    };

    return categoryMap[value] ?? categoryMap[normalizedValue] ?? "ETC";
}

function validateTitle(title: string) {
    if (!title) {
        return "제목을 입력해주세요.";
    }

    if (title.length > 80) {
        return "제목은 80자 이하로 입력해주세요.";
    }

    return null;
}

function validateDate(month: number | null, day: number | null) {
    if (month === null || month < 1 || month > 12) {
        return "월은 1부터 12 사이로 입력해주세요.";
    }

    if (day === null || day < 1 || day > 31) {
        return "일은 1부터 31 사이로 입력해주세요.";
    }

    return null;
}

function validateDescription(description: string) {
    if (!description) {
        return "설명을 입력해주세요.";
    }

    if (description.length > 1000) {
        return "설명은 1000자 이하로 입력해주세요.";
    }

    return null;
}

function validateUrl(sourceUrl: string, required: boolean) {
    if (!sourceUrl && !required) {
        return null;
    }

    if (!sourceUrl && required) {
        return "출처 URL을 입력해주세요.";
    }

    try {
        const url = new URL(sourceUrl);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return "출처 URL은 http 또는 https 주소여야 합니다.";
        }

        return null;
    } catch {
        return "올바른 출처 URL을 입력해주세요.";
    }
}

async function createSubmission({
                                    type,
                                    title,
                                    month,
                                    day,
                                    category,
                                    eventType,
                                    sourceUrl,
                                    description,
                                    submitterEmail,
                                }: {
    type: SubmissionType;
    title: string;
    month: number;
    day: number;
    category: EventCategory;
    eventType: EventType;
    sourceUrl: string | null;
    description: string;
    submitterEmail: string | null;
}) {
    await prisma.submission.create({
        data: {
            type,
            title,
            month,
            day,
            category,
            sourceUrl,
            description: `[분류:${eventType}] ${description}`,
            submitterEmail,
        },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/submissions");
}

export async function createNewEventSubmission(
    _prevState: SubmitState,
    formData: FormData
): Promise<SubmitState> {
    try {
        const title = String(formData.get("title") ?? "").trim();
        const month = toNumberOrNull(formData.get("month"));
        const day = toNumberOrNull(formData.get("day"));
        const eventType = toEventType(String(formData.get("eventType") ?? ""));
        const category = toEventCategory(String(formData.get("category") ?? ""));
        const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();

        const titleError = validateTitle(title);
        if (titleError) return { ok: false, message: titleError };

        const dateError = validateDate(month, day);
        if (dateError) return { ok: false, message: dateError };

        const descriptionError = validateDescription(description);
        if (descriptionError) return { ok: false, message: descriptionError };

        const urlError = validateUrl(sourceUrl, false);
        if (urlError) return { ok: false, message: urlError };

        await createSubmission({
            type: "NEW_EVENT",
            title,
            month: month as number,
            day: day as number,
            category,
            eventType,
            sourceUrl: sourceUrl || null,
            description,
            submitterEmail: submitterEmail || null,
        });

        return {
            ok: true,
            message: "신규 항목 제보가 접수되었습니다. 관리자 검수 후 공개됩니다.",
        };
    } catch (error) {
        console.error("createNewEventSubmission error:", error);

        return {
            ok: false,
            message: "제보 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        };
    }
}

export async function createEditRequestSubmission(
    _prevState: SubmitState,
    formData: FormData
): Promise<SubmitState> {
    try {
        const title = String(formData.get("title") ?? "").trim();
        const month = toNumberOrNull(formData.get("month"));
        const day = toNumberOrNull(formData.get("day"));
        const eventType = toEventType(String(formData.get("eventType") ?? ""));
        const category = toEventCategory(String(formData.get("category") ?? ""));
        const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();

        const titleError = validateTitle(title);
        if (titleError) return { ok: false, message: titleError };

        const dateError = validateDate(month, day);
        if (dateError) return { ok: false, message: dateError };

        const descriptionError = validateDescription(description);
        if (descriptionError) return { ok: false, message: descriptionError };

        const urlError = validateUrl(sourceUrl, false);
        if (urlError) return { ok: false, message: urlError };

        await createSubmission({
            type: "EDIT_REQUEST",
            title,
            month: month as number,
            day: day as number,
            category,
            eventType,
            sourceUrl: sourceUrl || null,
            description,
            submitterEmail: submitterEmail || null,
        });

        return {
            ok: true,
            message:
                "수정 제안이 접수되었습니다. 승인되더라도 항목 내용은 자동 변경되지 않고, 관리자가 직접 확인 후 수정합니다.",
        };
    } catch (error) {
        console.error("createEditRequestSubmission error:", error);

        return {
            ok: false,
            message: "수정 제안 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        };
    }
}

export async function createSourceRequestSubmission(
    _prevState: SubmitState,
    formData: FormData
): Promise<SubmitState> {
    try {
        const title = String(formData.get("title") ?? "").trim();
        const month = toNumberOrNull(formData.get("month"));
        const day = toNumberOrNull(formData.get("day"));
        const eventType = toEventType(String(formData.get("eventType") ?? ""));
        const category = toEventCategory(String(formData.get("category") ?? ""));
        const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();

        const titleError = validateTitle(title);
        if (titleError) return { ok: false, message: titleError };

        const dateError = validateDate(month, day);
        if (dateError) return { ok: false, message: dateError };

        const urlError = validateUrl(sourceUrl, true);
        if (urlError) return { ok: false, message: urlError };

        await createSubmission({
            type: "SOURCE_ADD",
            title,
            month: month as number,
            day: day as number,
            category,
            eventType,
            sourceUrl,
            description:
                description ||
                `${title} 항목에 공개적으로 확인 가능한 출처를 추가하는 요청입니다.`,
            submitterEmail: submitterEmail || null,
        });

        return {
            ok: true,
            message: "출처 추가 요청이 접수되었습니다. 관리자 승인 후 항목에 반영됩니다.",
        };
    } catch (error) {
        console.error("createSourceRequestSubmission error:", error);

        return {
            ok: false,
            message: "출처 추가 요청 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        };
    }
}