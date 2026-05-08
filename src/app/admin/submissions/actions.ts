"use server";

import { revalidatePath } from "next/cache";
import {
    EventCategory,
    EventType,
    SubmissionStatus,
    TrustLevel,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSlugWithDate } from "@/lib/slug";

function mapCategoryToEventCategory(category?: string | null): EventCategory {
    if (!category) return "ANNIVERSARY";

    const map: Record<string, EventCategory> = {
        생일: "CELEBRITY",
        기념일: "ANNIVERSARY",
        밈: "MEME",
        "팬덤 이벤트": "KPOP",
        브랜드: "BRAND",
        역사: "HISTORY",
        인플루언서: "INFLUENCER",
    };

    return map[category] ?? "ANNIVERSARY";
}

function mapCategoryToEventType(category?: string | null): EventType {
    if (!category) return "ANNIVERSARY";

    const map: Record<string, EventType> = {
        생일: "BIRTHDAY",
        기념일: "ANNIVERSARY",
        밈: "MEME",
        "팬덤 이벤트": "FANDOM",
        브랜드: "BRAND",
        역사: "HISTORY",
        인플루언서: "BIRTHDAY",
    };

    return map[category] ?? "ANNIVERSARY";
}

async function createUniqueSlug(title: string, month?: number | null, day?: number | null) {
    const baseSlug = createSlugWithDate(title, month, day);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.event.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count}`;
        count += 1;
    }

    return slug;
}

export async function approveSubmission(submissionId: string) {
    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId,
        },
    });

    if (!submission) {
        throw new Error("제보를 찾을 수 없습니다.");
    }

    if (!submission.month || !submission.day) {
        await prisma.submission.update({
            where: {
                id: submissionId,
            },
            data: {
                status: "NEED_MORE",
                adminNote: "승인하려면 월/일 정보가 필요합니다.",
            },
        });

        revalidatePath("/admin/submissions");
        return;
    }

    const slug = await createUniqueSlug(
        submission.title,
        submission.month,
        submission.day
    );

    const event = await prisma.event.create({
        data: {
            title: submission.title,
            slug,
            month: submission.month,
            day: submission.day,
            type: mapCategoryToEventType(submission.category),
            category: mapCategoryToEventCategory(submission.category),
            description: submission.description,
            contentIdea: `${submission.title}와 관련된 콘텐츠 소재로 활용해보세요. 제보 내용을 바탕으로 등록된 항목입니다.`,
            trustLevel: "UNCERTAIN" satisfies TrustLevel,
            status: "PUBLISHED",
        },
    });

    if (submission.sourceUrl) {
        await prisma.source.create({
            data: {
                eventId: event.id,
                title: "제보 출처",
                url: submission.sourceUrl,
                type: "COMMUNITY",
                verified: false,
            },
        });
    }

    if (submission.category) {
        const tag = await prisma.tag.upsert({
            where: {
                name: submission.category,
            },
            update: {},
            create: {
                name: submission.category,
            },
        });

        await prisma.eventTag.create({
            data: {
                eventId: event.id,
                tagId: tag.id,
            },
        });
    }

    await prisma.submission.update({
        where: {
            id: submissionId,
        },
        data: {
            status: "APPROVED",
            adminNote: `Event로 등록됨: ${event.slug}`,
        },
    });

    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/admin");
    revalidatePath("/admin/submissions");
    revalidatePath("/admin/events");
}

export async function updateSubmissionStatus(
    submissionId: string,
    status: SubmissionStatus
) {
    await prisma.submission.update({
        where: {
            id: submissionId,
        },
        data: {
            status,
        },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/submissions");
}