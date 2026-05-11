"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    EventCategory,
    EventType,
    SourceType,
    SubmissionStatus,
} from "@prisma/client";

const reviewableStatuses: SubmissionStatus[] = ["PENDING", "NEED_MORE"];

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

function getAdminEventRedirectUrl(slug?: string | null) {
    if (!slug) {
        return "/admin/events";
    }

    return `/admin/events/${encodeURIComponent(slug)}`;
}

function revalidateAdminPaths(slug?: string | null) {
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

function createBaseSlug(title: string, month: number, day: number) {
    const normalizedTitle = title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const safeTitle = normalizedTitle || "event";

    return `${safeTitle}-${month}-${day}`;
}

async function createUniqueSlug(title: string, month: number, day: number) {
    const baseSlug = createBaseSlug(title, month, day);

    let slug = baseSlug;
    let count = 2;

    while (true) {
        const existingEvent = await prisma.event.findUnique({
            where: {
                slug,
            },
            select: {
                id: true,
            },
        });

        if (!existingEvent) {
            return slug;
        }

        slug = `${baseSlug}-${count}`;
        count += 1;
    }
}

function parseEventTypeFromDescription(description: string): {
    eventType: EventType;
    cleanDescription: string;
} {
    const match = description.match(
        /^\[분류:(BIRTHDAY|ANNIVERSARY|MEME|FANDOM|HISTORY|BRAND)]\s*/
    );

    if (!match) {
        return {
            eventType: "ANNIVERSARY",
            cleanDescription: description.trim(),
        };
    }

    const eventType = match[1] as EventType;

    return {
        eventType: eventTypes.includes(eventType) ? eventType : "ANNIVERSARY",
        cleanDescription: description.replace(match[0], "").trim(),
    };
}

function toEventCategory(value: string | null): EventCategory {
    const text = String(value ?? "").trim();

    if (eventCategories.includes(text as EventCategory)) {
        return text as EventCategory;
    }

    const koreanMap: Record<string, EventCategory> = {
        연예인: "CELEBRITY",
        유명인: "CELEBRITY",
        인플루언서: "INFLUENCER",
        케이팝: "KPOP",
        "K-POP": "KPOP",
        KPOP: "KPOP",
        이스포츠: "ESPORTS",
        e스포츠: "ESPORTS",
        E스포츠: "ESPORTS",
        게임: "GAME",
        애니: "ANIME",
        애니메이션: "ANIME",
        밈: "MEME",
        브랜드: "BRAND",
        역사: "HISTORY",
        사건: "HISTORY",
        기타: "ETC",
        생일: "ETC",
        기념일: "ETC",
    };

    return koreanMap[text] ?? "ETC";
}

function getSourceType(): SourceType {
    return "COMMUNITY";
}

async function findTargetEventForSubmission(submission: {
    title: string;
    month: number | null;
    day: number | null;
}) {
    if (!submission.month || !submission.day) {
        return null;
    }

    return prisma.event.findFirst({
        where: {
            title: submission.title,
            month: submission.month,
            day: submission.day,
        },
        select: {
            id: true,
            slug: true,
            title: true,
        },
    });
}

export async function approveSubmission(formData: FormData) {
    const submissionId = String(formData.get("submissionId") ?? "");

    if (!submissionId) {
        redirect("/admin/submissions");
    }

    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId,
        },
    });

    if (!submission) {
        redirect("/admin/submissions");
    }

    if (!reviewableStatuses.includes(submission.status)) {
        redirect("/admin/submissions");
    }

    let redirectUrl = "/admin/submissions";

    if (submission.type === "NEW_EVENT") {
        if (!submission.month || !submission.day) {
            await prisma.submission.updateMany({
                where: {
                    id: submission.id,
                    status: {
                        in: reviewableStatuses,
                    },
                },
                data: {
                    status: "REJECTED",
                },
            });

            revalidateAdminPaths();
            redirect("/admin/submissions");
        }

        const { eventType, cleanDescription } = parseEventTypeFromDescription(
            submission.description
        );

        const category = toEventCategory(submission.category);
        const slug = await createUniqueSlug(
            submission.title,
            submission.month,
            submission.day
        );

        const event = await prisma.$transaction(async (tx) => {
            const updateResult = await tx.submission.updateMany({
                where: {
                    id: submission.id,
                    status: {
                        in: reviewableStatuses,
                    },
                },
                data: {
                    status: "APPROVED",
                },
            });

            if (updateResult.count === 0) {
                return null;
            }

            const createdEvent = await tx.event.create({
                data: {
                    title: submission.title,
                    slug,
                    month: submission.month,
                    day: submission.day,
                    year: null,
                    type: eventType,
                    category,
                    description: cleanDescription || submission.description,
                    contentIdea: "",
                    trustLevel: submission.sourceUrl
                        ? "SOURCE_VERIFIED"
                        : "COMMUNITY",
                    status: "PUBLISHED",
                },
            });

            if (submission.sourceUrl) {
                await tx.source.create({
                    data: {
                        eventId: createdEvent.id,
                        title: "제보 출처",
                        url: submission.sourceUrl,
                        type: getSourceType(),
                        verified: true,
                    },
                });
            }

            return createdEvent;
        });

        if (event) {
            revalidateAdminPaths(event.slug);
            redirectUrl = getAdminEventRedirectUrl(event.slug);
        }
    }

    if (submission.type === "SOURCE_ADD") {
        const targetEvent = await findTargetEventForSubmission(submission);

        await prisma.$transaction(async (tx) => {
            const updateResult = await tx.submission.updateMany({
                where: {
                    id: submission.id,
                    status: {
                        in: reviewableStatuses,
                    },
                },
                data: {
                    status: "APPROVED",
                },
            });

            if (updateResult.count === 0) {
                return;
            }

            if (!targetEvent || !submission.sourceUrl) {
                return;
            }

            const existingSource = await tx.source.findFirst({
                where: {
                    eventId: targetEvent.id,
                    url: submission.sourceUrl,
                },
                select: {
                    id: true,
                },
            });

            if (!existingSource) {
                await tx.source.create({
                    data: {
                        eventId: targetEvent.id,
                        title: "추가 출처",
                        url: submission.sourceUrl,
                        type: getSourceType(),
                        verified: true,
                    },
                });
            }
        });

        if (targetEvent) {
            revalidateAdminPaths(targetEvent.slug);
            redirectUrl = getAdminEventRedirectUrl(targetEvent.slug);
        } else {
            revalidateAdminPaths();
        }
    }

    if (submission.type === "EDIT_REQUEST") {
        const targetEvent = await findTargetEventForSubmission(submission);

        await prisma.submission.updateMany({
            where: {
                id: submission.id,
                status: {
                    in: reviewableStatuses,
                },
            },
            data: {
                status: "APPROVED",
            },
        });

        if (targetEvent) {
            revalidateAdminPaths(targetEvent.slug);
            redirectUrl = getAdminEventRedirectUrl(targetEvent.slug);
        } else {
            revalidateAdminPaths();
        }
    }

    if (submission.type === "REPORT") {
        const targetEvent = await findTargetEventForSubmission(submission);

        await prisma.submission.updateMany({
            where: {
                id: submission.id,
                status: {
                    in: reviewableStatuses,
                },
            },
            data: {
                status: "APPROVED",
            },
        });

        if (targetEvent) {
            revalidateAdminPaths(targetEvent.slug);
            redirectUrl = getAdminEventRedirectUrl(targetEvent.slug);
        } else {
            revalidateAdminPaths();
        }
    }

    redirect(redirectUrl);
}

export async function holdSubmission(formData: FormData) {
    const submissionId = String(formData.get("submissionId") ?? "");

    if (!submissionId) {
        redirect("/admin/submissions");
    }

    await prisma.submission.updateMany({
        where: {
            id: submissionId,
            status: "PENDING",
        },
        data: {
            status: "NEED_MORE",
        },
    });

    revalidateAdminPaths();

    redirect("/admin/submissions");
}

export async function rejectSubmission(formData: FormData) {
    const submissionId = String(formData.get("submissionId") ?? "");

    if (!submissionId) {
        redirect("/admin/submissions");
    }

    await prisma.submission.updateMany({
        where: {
            id: submissionId,
            status: {
                in: reviewableStatuses,
            },
        },
        data: {
            status: "REJECTED",
        },
    });

    revalidateAdminPaths();

    redirect("/admin/submissions");
}

export async function deleteSubmission(formData: FormData) {
    const submissionId = String(formData.get("submissionId") ?? "");

    if (!submissionId) {
        redirect("/admin/submissions");
    }

    await prisma.submission.deleteMany({
        where: {
            id: submissionId,
        },
    });

    revalidateAdminPaths();

    redirect("/admin/submissions?status=all");
}