import { prisma } from "@/lib/prisma";

const statusLabelMap = {
    DRAFT: "초안",
    PUBLISHED: "공개",
    HIDDEN: "",
} as const;

const trustLabelMap = {
    OFFICIAL: "공식 확인",
    SOURCE_VERIFIED: "출처 확인",
    COMMUNITY: "커뮤니티 기반",
    UNCERTAIN: "불확실",
} as const;

export async function getAdminEventsFromDb() {
    const events = await prisma.event.findMany({
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
    });

    return events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        month: event.month,
        day: event.day,
        description: event.description,
        status: event.status,
        statusLabel: statusLabelMap[event.status],
        trustLabel: trustLabelMap[event.trustLevel],
        sourceCount: event.sources.length,
        tags: event.tags.map((item) => item.tag.name),
    }));
}