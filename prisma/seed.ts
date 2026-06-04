import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedCategory = "KPOP" | "CELEBRITY" | "ANIME";

type SeedItem = {
    title: string;
    slug: string;
    month: number;
    day: number;
    year: number | null;
    type: "BIRTHDAY";
    category: SeedCategory;
    description: string;
    contentIdea: string;
    trustLevel: "SOURCE_VERIFIED";
    status: "PUBLISHED";
    sourceTitle: string;
    sourceUrl: string;
    tags: string[];
};

type WikidataBinding = {
    item: {
        value: string;
    };
    itemLabel?: {
        value: string;
    };
    birthDate?: {
        value: string;
    };
};

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

function sanitizeSlugText(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function getWikidataId(url: string) {
    return url.split("/").pop() ?? "unknown";
}

function createSlug(title: string, month: number, day: number, id: string) {
    const base = sanitizeSlugText(title) || "event";
    const safeId = sanitizeSlugText(id);

    return `${base}-${month}-${day}-${safeId}`;
}

function parseDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
    };
}

function uniqueByTitleAndDate(items: SeedItem[]) {
    const seen = new Set<string>();

    return items.filter((item) => {
        const key = `${item.title}-${item.month}-${item.day}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

async function fetchWikidata(query: string): Promise<WikidataBinding[]> {
    const url = `${WIKIDATA_ENDPOINT}?query=${encodeURIComponent(
        query
    )}&format=json`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/sparql-results+json",
            "User-Agent": "TadayLabSeed/1.0 (https://tadaylab.today)",
        },
    });

    if (!response.ok) {
        throw new Error(`Wikidata request failed: ${response.status}`);
    }

    const data = await response.json();

    return data.results.bindings as WikidataBinding[];
}

function toSeedItems(
    bindings: WikidataBinding[],
    options: {
        category: SeedCategory;
        limit: number;
        description: (title: string) => string;
        contentIdea: (title: string) => string;
        tags: string[];
    }
): SeedItem[] {
    const items: SeedItem[] = [];

    for (const binding of bindings) {
        const title = binding.itemLabel?.value?.trim();
        const birthDate = binding.birthDate?.value;
        const itemUrl = binding.item.value;

        if (!title || !birthDate || !itemUrl) {
            continue;
        }

        const parsedDate = parseDate(birthDate);

        if (!parsedDate) {
            continue;
        }

        const wikidataId = getWikidataId(itemUrl);

        items.push({
            title,
            slug: createSlug(title, parsedDate.month, parsedDate.day, wikidataId),
            month: parsedDate.month,
            day: parsedDate.day,
            year: parsedDate.year,
            type: "BIRTHDAY",
            category: options.category,
            description: options.description(title),
            contentIdea: options.contentIdea(title),
            trustLevel: "SOURCE_VERIFIED",
            status: "PUBLISHED",
            sourceTitle: "Wikidata",
            sourceUrl: itemUrl,
            tags: options.tags,
        });

        if (items.length >= options.limit) {
            break;
        }
    }

    return uniqueByTitleAndDate(items).slice(0, options.limit);
}

async function getKpopLikeBirthdays() {
    const query = `
SELECT DISTINCT ?item ?itemLabel ?birthDate WHERE {
  ?item wdt:P31 wd:Q5;
        wdt:P569 ?birthDate;
        wdt:P27 wd:Q884.
  ?item wdt:P106 ?occupation.
  VALUES ?occupation {
    wd:Q177220
    wd:Q639669
    wd:Q36834
    wd:Q10800557
  }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ko,en".
  }
}
ORDER BY ?birthDate ?itemLabel
LIMIT 120
`;

    const bindings = await fetchWikidata(query);

    return toSeedItems(bindings, {
        category: "KPOP",
        limit: 60,
        description: (title) =>
            `${title}의 생일입니다. Wikidata 기준 생년월일 정보를 바탕으로 등록된 항목입니다.`,
        contentIdea: (title) =>
            `${title} 생일에 맞춰 팬 콘텐츠, 생일 축하 게시물, 날짜 기반 검색 콘텐츠로 활용할 수 있습니다.`,
        tags: ["생일", "아이돌", "KPOP"],
    });
}

async function getKoreanActorBirthdays() {
    const query = `
SELECT DISTINCT ?item ?itemLabel ?birthDate WHERE {
  ?item wdt:P31 wd:Q5;
        wdt:P569 ?birthDate;
        wdt:P27 wd:Q884;
        wdt:P106 wd:Q33999.
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ko,en".
  }
}
ORDER BY ?birthDate ?itemLabel
LIMIT 80
`;

    const bindings = await fetchWikidata(query);

    return toSeedItems(bindings, {
        category: "CELEBRITY",
        limit: 30,
        description: (title) =>
            `${title}의 생일입니다. Wikidata 기준 생년월일 정보를 바탕으로 등록된 한국 배우 항목입니다.`,
        contentIdea: (title) =>
            `${title} 생일에 맞춰 배우 생일 콘텐츠, 작품 회고, 팬 게시물 소재로 활용할 수 있습니다.`,
        tags: ["생일", "한국배우", "배우"],
    });
}

async function getAnimeCharacterBirthdays() {
    const query = `
SELECT DISTINCT ?item ?itemLabel ?birthDate WHERE {
  ?item wdt:P31/wdt:P279* wd:Q15773347;
        wdt:P569 ?birthDate.
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "ko,en".
  }
}
ORDER BY ?birthDate ?itemLabel
LIMIT 40
`;

    const bindings = await fetchWikidata(query);

    return toSeedItems(bindings, {
        category: "ANIME",
        limit: 10,
        description: (title) =>
            `${title}의 생일입니다. Wikidata 기준 생년월일 정보를 바탕으로 등록된 애니메이션 캐릭터 항목입니다.`,
        contentIdea: (title) =>
            `${title} 생일에 맞춰 캐릭터 생일 콘텐츠, 팬아트 주제, 날짜 기반 콘텐츠 소재로 활용할 수 있습니다.`,
        tags: ["생일", "애니", "캐릭터"],
    });
}

async function clearDatabase() {
    await prisma.eventTag.deleteMany();
    await prisma.source.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.event.deleteMany();
    await prisma.submission.deleteMany();
}

async function connectTags(eventId: string, tags: string[]) {
    for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
            where: {
                name: tagName,
            },
            update: {},
            create: {
                name: tagName,
            },
        });

        await prisma.eventTag.create({
            data: {
                eventId,
                tagId: tag.id,
            },
        });
    }
}

async function createEvent(item: SeedItem) {
    const event = await prisma.event.create({
        data: {
            title: item.title,
            slug: item.slug,
            month: item.month,
            day: item.day,
            year: item.year,
            type: item.type,
            category: item.category,
            description: item.description,
            contentIdea: item.contentIdea,
            trustLevel: item.trustLevel,
            status: item.status,
            sources: {
                create: {
                    title: item.sourceTitle,
                    url: item.sourceUrl,
                    type: "WIKI",
                    verified: true,
                },
            },
        },
    });

    await connectTags(event.id, item.tags);
}

async function main() {
    console.log("기존 DB 데이터를 삭제합니다.");
    await clearDatabase();

    console.log("Wikidata에서 실제 생일 데이터를 가져옵니다.");

    const [idolBirthdays, actorBirthdays, animeBirthdays] = await Promise.all([
        getKpopLikeBirthdays(),
        getKoreanActorBirthdays(),
        getAnimeCharacterBirthdays(),
    ]);

    const seedItems = [
        ...idolBirthdays,
        ...actorBirthdays,
        ...animeBirthdays,
    ];

    console.log(`아이돌/가수 계열: ${idolBirthdays.length}개`);
    console.log(`한국 배우: ${actorBirthdays.length}개`);
    console.log(`애니 캐릭터: ${animeBirthdays.length}개`);
    console.log(`총 ${seedItems.length}개 데이터를 등록합니다.`);

    for (const item of seedItems) {
        await createEvent(item);
    }

    console.log("Seed 완료");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });