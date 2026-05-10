import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedEvents = [
    {
        title: "세계 웃음의 날",
        slug: "world-laughter-day",
        month: 5,
        day: 7,
        type: "ANNIVERSARY" as const,
        category: "ETC" as const,
        description: "웃음과 긍정적인 에너지를 나누자는 취지의 기념일입니다.",
        contentIdea:
            "직장인 공감 짤, 친구에게 보내는 유머 카드, 오늘 하루 웃겼던 순간을 숏폼이나 SNS 게시물로 만들기 좋아요.",
        trustLevel: "SOURCE_VERIFIED" as const,
        tags: ["기념일", "힐링", "SNS소재"],
        sources: [
            {
                title: "기념일 소개 자료",
                url: "https://example.com",
                type: "WIKI" as const,
                verified: true,
            },
        ],
    },
    {
        title: "가상 아이돌 A 생일",
        slug: "idol-a-birthday",
        month: 5,
        day: 7,
        type: "BIRTHDAY" as const,
        category: "KPOP" as const,
        description:
            "팬덤 사이에서 매년 축하 콘텐츠가 많이 올라오는 아이돌 생일입니다.",
        contentIdea:
            "생일 축하 이미지, 최애 무대 모음, 입덕 계기, 팬아트 리그램 콘텐츠로 활용할 수 있어요.",
        trustLevel: "OFFICIAL" as const,
        tags: ["KPOP", "생일", "팬덤"],
        sources: [
            {
                title: "공식 프로필",
                url: "https://example.com",
                type: "OFFICIAL" as const,
                verified: true,
            },
        ],
    },
    {
        title: "인터넷 밈 다시 꺼내기 좋은 날",
        slug: "meme-revival-day",
        month: 5,
        day: 7,
        type: "MEME" as const,
        category: "MEME" as const,
        description:
            "정확한 시작일은 불확실하지만, 커뮤니티에서 반복적으로 언급되는 밈 소재입니다.",
        contentIdea:
            "요즘 상황에 맞게 밈을 재해석하거나, 과거 유행과 현재를 비교하는 콘텐츠로 쓰기 좋아요.",
        trustLevel: "COMMUNITY" as const,
        tags: ["밈", "커뮤니티", "숏폼"],
        sources: [
            {
                title: "커뮤니티 언급 자료",
                url: "https://example.com",
                type: "COMMUNITY" as const,
                verified: false,
            },
        ],
    },
    {
        title: "페이커 생일",
        slug: "faker-birthday",
        month: 5,
        day: 7,
        type: "BIRTHDAY" as const,
        category: "ESPORTS" as const,
        description:
            "프로게이머 페이커의 생일입니다. 팬덤 사이에서 축하 게시물과 관련 콘텐츠가 자주 올라오는 소재입니다.",
        contentIdea:
            "페이커의 생일을 맞아 팬들이 기억하는 명장면, 우승 순간, 인상 깊었던 인터뷰를 모아 콘텐츠로 활용할 수 있어요.",
        trustLevel: "SOURCE_VERIFIED" as const,
        tags: ["e스포츠", "생일", "팬덤"],
        sources: [
            {
                title: "공개 프로필 자료",
                url: "https://example.com",
                type: "WIKI" as const,
                verified: true,
            },
        ],
    },
];

async function main() {
    for (const item of seedEvents) {
        const event = await prisma.event.upsert({
            where: {
                slug: item.slug,
            },
            update: {
                title: item.title,
                month: item.month,
                day: item.day,
                type: item.type,
                category: item.category,
                description: item.description,
                contentIdea: item.contentIdea,
                trustLevel: item.trustLevel,
                status: "PUBLISHED",
            },
            create: {
                title: item.title,
                slug: item.slug,
                month: item.month,
                day: item.day,
                type: item.type,
                category: item.category,
                description: item.description,
                contentIdea: item.contentIdea,
                trustLevel: item.trustLevel,
                status: "PUBLISHED",
            },
        });

        await prisma.source.deleteMany({
            where: {
                eventId: event.id,
            },
        });

        for (const source of item.sources) {
            await prisma.source.create({
                data: {
                    eventId: event.id,
                    title: source.title,
                    url: source.url,
                    type: source.type,
                    verified: source.verified,
                },
            });
        }

        await prisma.eventTag.deleteMany({
            where: {
                eventId: event.id,
            },
        });

        for (const tagName of item.tags) {
            const tag = await prisma.tag.upsert({
                where: {
                    name: tagName,
                },
                update: {},
                create: {
                    name: tagName,
                },
            });

            await prisma.eventTag.upsert({
                where: {
                    eventId_tagId: {
                        eventId: event.id,
                        tagId: tag.id,
                    },
                },
                update: {},
                create: {
                    eventId: event.id,
                    tagId: tag.id,
                },
            });
        }
    }
}

main()
    .then(async () => {
        console.log("Seed completed");
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });