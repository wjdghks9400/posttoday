import { CalendarEvent } from "@/types/event";

export const mockEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "세계 웃음의 날",
        slug: "world-laughter-day",
        month: 5,
        day: 7,
        type: "ANNIVERSARY",
        category: "anniversary",
        description: "웃음과 긍정적인 에너지를 나누자는 취지의 기념일입니다.",
        contentIdea:
            "직장인 공감 짤, 친구에게 보내는 유머 카드, 오늘 하루 웃겼던 순간을 숏폼으로 만들기 좋아요.",
        trustLevel: "SOURCE_VERIFIED",
        tags: ["기념일", "힐링", "SNS소재"],
        sources: [
            {
                id: "s1",
                title: "기념일 소개 자료",
                url: "https://example.com",
                type: "wiki",
            },
        ],
    },
    {
        id: "2",
        title: "가상 아이돌 A 생일",
        slug: "idol-a-birthday",
        month: 5,
        day: 7,
        type: "BIRTHDAY",
        category: "kpop",
        description:
            "팬덤 사이에서 매년 축하 콘텐츠가 많이 올라오는 아이돌 생일입니다.",
        contentIdea:
            "생일 축하 이미지, 최애 무대 모음, 입덕 계기, 팬아트 리그램 콘텐츠로 활용할 수 있어요.",
        trustLevel: "OFFICIAL",
        tags: ["KPOP", "생일", "팬덤"],
        sources: [
            {
                id: "s2",
                title: "공식 프로필",
                url: "https://example.com",
                type: "official",
            },
        ],
    },
    {
        id: "3",
        title: "인터넷 밈 다시 꺼내기 좋은 날",
        slug: "meme-revival-day",
        month: 5,
        day: 7,
        type: "MEME",
        category: "meme",
        description:
            "정확한 시작일은 불확실하지만, 커뮤니티에서 반복적으로 언급되는 밈 소재입니다.",
        contentIdea:
            "요즘 상황에 맞게 밈을 재해석하거나, 과거 유행과 현재를 비교하는 콘텐츠로 쓰기 좋아요.",
        trustLevel: "COMMUNITY",
        tags: ["밈", "커뮤니티", "숏폼"],
        sources: [
            {
                id: "s3",
                title: "커뮤니티 언급 자료",
                url: "https://example.com",
                type: "community",
            },
        ],
    },
    {
        id: "4",
        title: "브랜드 감사 이벤트 데이",
        slug: "brand-thank-you-day",
        month: 5,
        day: 7,
        type: "BRAND",
        category: "brand",
        description:
            "브랜드 계정에서 고객 감사 메시지나 이벤트를 기획하기 좋은 날짜형 소재입니다.",
        contentIdea:
            "팔로워 감사 이벤트, 댓글 이벤트, 쿠폰 배포, 고객 후기 리그램 콘텐츠로 활용하기 좋아요.",
        trustLevel: "UNCERTAIN",
        tags: ["브랜드", "마케팅", "이벤트"],
        sources: [],
    },
    {
        id: "5",
        title: "크리에이터 데뷔일",
        slug: "creator-debut-day",
        month: 5,
        day: 8,
        type: "FANDOM",
        category: "influencer",
        description:
            "특정 크리에이터가 첫 영상을 올린 날로, 팬들이 회고 콘텐츠를 만들기 좋은 날입니다.",
        contentIdea:
            "첫 영상 다시보기, 지금과 비교하기, 팬이 뽑은 레전드 순간 모음 콘텐츠로 좋아요.",
        trustLevel: "SOURCE_VERIFIED",
        tags: ["유튜버", "데뷔일", "팬덤"],
        sources: [
            {
                id: "s4",
                title: "첫 업로드 영상",
                url: "https://example.com",
                type: "sns",
            },
        ],
    },
    {
        id: "6",
        title: "고전 애니 방영 기념일",
        slug: "classic-animation-anniversary",
        month: 5,
        day: 9,
        type: "ANNIVERSARY",
        category: "anniversary",
        description:
            "오래된 애니메이션의 첫 방영일로, 추억 콘텐츠와 세대 공감 콘텐츠에 적합합니다.",
        contentIdea:
            "그 시절 추억 소환, 명장면 TOP 5, 지금 보면 다른 점 같은 콘텐츠로 활용하기 좋아요.",
        trustLevel: "SOURCE_VERIFIED",
        tags: ["애니", "추억", "기념일"],
        sources: [
            {
                id: "s5",
                title: "방영 정보 자료",
                url: "https://example.com",
                type: "wiki",
            },
        ],
    },
    {
        id: "7",
        title: "오늘의 역사적 사건",
        slug: "today-history-event",
        month: 5,
        day: 10,
        type: "HISTORY",
        category: "history",
        description:
            "과거 오늘 발생했던 역사적 사건을 짧은 교양 콘텐츠로 풀어낼 수 있는 소재입니다.",
        contentIdea:
            "1분 역사 쇼츠, 카드뉴스, 오늘의 TMI, 퀴즈형 콘텐츠로 만들기 좋아요.",
        trustLevel: "SOURCE_VERIFIED",
        tags: ["역사", "교양", "카드뉴스"],
        sources: [
            {
                id: "s6",
                title: "역사 자료",
                url: "https://example.com",
                type: "wiki",
            },
        ],
    },
    {
        id: "8",
        title: "팬덤 해시태그 이벤트",
        slug: "fandom-hashtag-event",
        month: 5,
        day: 11,
        type: "FANDOM",
        category: "kpop",
        description:
            "팬들이 특정 해시태그를 중심으로 축하 글과 이미지를 올리는 이벤트입니다.",
        contentIdea:
            "해시태그 참여 독려, 팬아트 모음, 축하 메시지 템플릿 공유 콘텐츠로 활용하기 좋아요.",
        trustLevel: "COMMUNITY",
        tags: ["팬덤", "해시태그", "이벤트"],
        sources: [
            {
                id: "s7",
                title: "팬덤 공지",
                url: "https://example.com",
                type: "community",
            },
        ],
    },
    {
        id: "9",
        title: "먹방 유튜버 B 생일",
        slug: "mukbang-youtuber-b-birthday",
        month: 5,
        day: 12,
        type: "BIRTHDAY",
        category: "influencer",
        description:
            "먹방 콘텐츠로 알려진 크리에이터의 생일입니다. 음식 관련 콘텐츠와 엮기 좋습니다.",
        contentIdea:
            "최애 메뉴 월드컵, 레전드 먹방 모음, 생일상 추천 콘텐츠로 활용하기 좋아요.",
        trustLevel: "OFFICIAL",
        tags: ["유튜버", "생일", "먹방"],
        sources: [
            {
                id: "s8",
                title: "공식 SNS",
                url: "https://example.com",
                type: "official",
            },
        ],
    },
];

export function getTodayEvents() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const matchedEvents = mockEvents.filter(
        (event) => event.month === month && event.day === day
    );

    return matchedEvents.length > 0 ? matchedEvents : mockEvents.slice(0, 6);
}

export function getFeaturedEvents() {
    return mockEvents.slice(0, 3);
}

export function getWeeklyEvents() {
    return mockEvents.slice(0, 7);
}

export function getEventStats() {
    return {
        total: mockEvents.length,
        official: mockEvents.filter((event) => event.trustLevel === "OFFICIAL")
            .length,
        community: mockEvents.filter((event) => event.trustLevel === "COMMUNITY")
            .length,
        pending: 4,
    };
}

export function getEventBySlug(slug: string) {
    return mockEvents.find((event) => event.slug === slug);
}

export function getRelatedEvents(currentSlug: string) {
    return mockEvents
        .filter((event) => event.slug !== currentSlug)
        .slice(0, 3);
}

export function getEventsByDate(month: number, day: number) {
    return mockEvents.filter((event) => event.month === month && event.day === day);
}

export function getEventsByMonth(month: number) {
    return mockEvents.filter((event) => event.month === month);
}

export function getCalendarDays(year: number, month: number) {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);
    const firstDay = firstDate.getDay();
    const totalDays = lastDate.getDate();

    const days: Array<{
        day: number | null;
        events: CalendarEvent[];
    }> = [];

    for (let i = 0; i < firstDay; i += 1) {
        days.push({
            day: null,
            events: [],
        });
    }

    for (let day = 1; day <= totalDays; day += 1) {
        days.push({
            day,
            events: getEventsByDate(month, day),
        });
    }

    return days;
}