"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface OneLineState {
    ok: boolean;
    message: string;
}

const MIN_BODY_LENGTH = 2;
const MAX_BODY_LENGTH = 100;
const MAX_NICKNAME_LENGTH = 20;
const COOLDOWN_SECONDS = 60;

function hasUrl(text: string) {
    return /(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(text);
}

function normalizeBody(text: string) {
    return text.replace(/\s+/g, " ").trim();
}

async function getRequestMeta() {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    const realIp = headerStore.get("x-real-ip");
    const userAgent = headerStore.get("user-agent") ?? "";
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
    const salt = process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "todaylab";
    const ipHash = crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");

    return {
        ipHash,
        userAgent: userAgent.slice(0, 300),
    };
}

export async function createOneLine(
    _prevState: OneLineState,
    formData: FormData
): Promise<OneLineState> {
    try {
        const eventId = String(formData.get("eventId") ?? "").trim();
        const slug = String(formData.get("slug") ?? "").trim();
        const nickname = String(formData.get("nickname") ?? "").trim();
        const body = normalizeBody(String(formData.get("body") ?? ""));
        const website = String(formData.get("website") ?? "").trim();

        if (website) {
            return {
                ok: false,
                message: "작성에 실패했습니다.",
            };
        }

        if (!eventId || !slug) {
            return {
                ok: false,
                message: "항목 정보를 찾을 수 없습니다.",
            };
        }

        if (nickname.length > MAX_NICKNAME_LENGTH) {
            return {
                ok: false,
                message: `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`,
            };
        }

        if (body.length < MIN_BODY_LENGTH) {
            return {
                ok: false,
                message: "한줄은 2자 이상 입력해주세요.",
            };
        }

        if (body.length > MAX_BODY_LENGTH) {
            return {
                ok: false,
                message: `한줄은 ${MAX_BODY_LENGTH}자 이하로 입력해주세요.`,
            };
        }

        if (hasUrl(body)) {
            return {
                ok: false,
                message: "한줄쓰기에는 링크를 넣을 수 없습니다.",
            };
        }

        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                slug,
                status: "PUBLISHED",
            },
            select: {
                id: true,
            },
        });

        if (!event) {
            return {
                ok: false,
                message: "공개된 항목에만 한줄을 남길 수 있습니다.",
            };
        }

        const { ipHash, userAgent } = await getRequestMeta();
        const cooldownDate = new Date(Date.now() - COOLDOWN_SECONDS * 1000);

        const recentOneLine = await prisma.oneLine.findFirst({
            where: {
                ipHash,
                createdAt: {
                    gte: cooldownDate,
                },
            },
            select: {
                id: true,
            },
        });

        if (recentOneLine) {
            return {
                ok: false,
                message: `${COOLDOWN_SECONDS}초에 한 번만 작성할 수 있습니다.`,
            };
        }

        const duplicatedOneLine = await prisma.oneLine.findFirst({
            where: {
                eventId,
                ipHash,
                body,
            },
            select: {
                id: true,
            },
        });

        if (duplicatedOneLine) {
            return {
                ok: false,
                message: "이미 같은 한줄을 남겼습니다.",
            };
        }

        await prisma.oneLine.create({
            data: {
                eventId,
                nickname: nickname || null,
                body,
                ipHash,
                userAgent,
            },
        });

        revalidatePath(`/events/${encodeURIComponent(slug)}`);
        revalidatePath("/admin");
        revalidatePath("/admin/one-lines");

        return {
            ok: true,
            message: "한줄이 등록되었습니다.",
        };
    } catch (error) {
        console.error("createOneLine error:", error);

        return {
            ok: false,
            message: "한줄 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        };
    }
}
