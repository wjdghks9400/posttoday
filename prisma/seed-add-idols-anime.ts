import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Category = "KPOP" | "ANIME";

type SeedItem = {
    title: string;
    group: string;
    month: number;
    day: number;
    year?: number | null;
    category: Category;
    sourceUrl: string;
};

const sourceUrls: Record<string, string> = {
    SEVENTEEN: "https://kprofiles.com/seventeen-members-profile/",
    ATEEZ: "https://kprofiles.com/ateez-members-profile/",
    TREASURE: "https://kprofiles.com/treasure-members-profile/",
    "THE BOYZ": "https://kprofiles.com/the-boyz-members-profile/",
    BOYNEXTDOOR: "https://kprofiles.com/boynextdoor-members-profile/",
    "NCT DREAM": "https://kprofiles.com/nct-dream-members-profile/",
    TWICE: "https://kprofiles.com/twice-members-profile/",
    BLACKPINK: "https://kprofiles.com/black-pink-members-profile/",
    "Red Velvet": "https://kprofiles.com/red-velvet-members-profile/",
    STAYC: "https://kprofiles.com/stayc-members-profile/",
    MAMAMOO: "https://kprofiles.com/mamamoo-members-profile/",
    EXO: "https://kprofiles.com/exo-members-profile/",
    "MONSTA X": "https://kprofiles.com/monsta-x-members-profile/",
    DAY6: "https://kprofiles.com/day6-members-profile/",

    "One Piece": "https://onepiece.fandom.com/wiki/Straw_Hat_Pirates",
    Naruto: "https://naruto.fandom.com/wiki/Characters",
    "Demon Slayer": "https://kimetsu-no-yaiba.fandom.com/wiki/Characters",
    "Jujutsu Kaisen": "https://jujutsu-kaisen.fandom.com/wiki/Characters",
    "My Hero Academia": "https://myheroacademia.fandom.com/wiki/Events/Birthdays",
    Haikyuu: "https://haikyuu.fandom.com/wiki/Characters",
    Bleach: "https://bleach.fandom.com/wiki/Characters",
    "Attack on Titan": "https://attackontitan.fandom.com/wiki/Characters",
    "Sailor Moon": "https://sailormoon.fandom.com/wiki/Characters",
    "Tokyo Revengers": "https://tokyorevengers.fandom.com/wiki/Characters",
};

const idolItems: SeedItem[] = [
    { title: "에스쿱스", group: "SEVENTEEN", month: 8, day: 8, year: 1995, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "정한", group: "SEVENTEEN", month: 10, day: 4, year: 1995, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "조슈아", group: "SEVENTEEN", month: 12, day: 30, year: 1995, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "준", group: "SEVENTEEN", month: 6, day: 10, year: 1996, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "호시", group: "SEVENTEEN", month: 6, day: 15, year: 1996, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "원우", group: "SEVENTEEN", month: 7, day: 17, year: 1996, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "우지", group: "SEVENTEEN", month: 11, day: 22, year: 1996, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "도겸", group: "SEVENTEEN", month: 2, day: 18, year: 1997, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "민규", group: "SEVENTEEN", month: 4, day: 6, year: 1997, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "디에잇", group: "SEVENTEEN", month: 11, day: 7, year: 1997, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "승관", group: "SEVENTEEN", month: 1, day: 16, year: 1998, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "버논", group: "SEVENTEEN", month: 2, day: 18, year: 1998, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },
    { title: "디노", group: "SEVENTEEN", month: 2, day: 11, year: 1999, category: "KPOP", sourceUrl: sourceUrls.SEVENTEEN },

    { title: "홍중", group: "ATEEZ", month: 11, day: 7, year: 1998, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },
    { title: "성화", group: "ATEEZ", month: 4, day: 3, year: 1998, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },
    { title: "윤호", group: "ATEEZ", month: 3, day: 23, year: 1999, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },
    { title: "여상", group: "ATEEZ", month: 6, day: 15, year: 1999, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },
    { title: "산", group: "ATEEZ", month: 7, day: 10, year: 1999, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },
    { title: "민기", group: "ATEEZ", month: 8, day: 9, year: 1999, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },
    { title: "우영", group: "ATEEZ", month: 11, day: 26, year: 1999, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },
    { title: "종호", group: "ATEEZ", month: 10, day: 12, year: 2000, category: "KPOP", sourceUrl: sourceUrls.ATEEZ },

    { title: "최현석", group: "TREASURE", month: 4, day: 21, year: 1999, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "지훈", group: "TREASURE", month: 3, day: 14, year: 2000, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "요시", group: "TREASURE", month: 5, day: 15, year: 2000, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "준규", group: "TREASURE", month: 9, day: 9, year: 2000, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "윤재혁", group: "TREASURE", month: 7, day: 23, year: 2001, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "아사히", group: "TREASURE", month: 8, day: 20, year: 2001, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "도영", group: "TREASURE", month: 12, day: 4, year: 2003, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "하루토", group: "TREASURE", month: 4, day: 5, year: 2004, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "박정우", group: "TREASURE", month: 9, day: 28, year: 2004, category: "KPOP", sourceUrl: sourceUrls.TREASURE },
    { title: "소정환", group: "TREASURE", month: 2, day: 18, year: 2005, category: "KPOP", sourceUrl: sourceUrls.TREASURE },

    { title: "상연", group: "THE BOYZ", month: 11, day: 4, year: 1996, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "제이콥", group: "THE BOYZ", month: 5, day: 30, year: 1997, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "영훈", group: "THE BOYZ", month: 8, day: 8, year: 1997, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "현재", group: "THE BOYZ", month: 9, day: 13, year: 1997, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "주연", group: "THE BOYZ", month: 1, day: 15, year: 1998, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "케빈", group: "THE BOYZ", month: 2, day: 23, year: 1998, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "뉴", group: "THE BOYZ", month: 4, day: 26, year: 1998, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "큐", group: "THE BOYZ", month: 11, day: 5, year: 1998, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "주학년", group: "THE BOYZ", month: 3, day: 9, year: 1999, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "선우", group: "THE BOYZ", month: 4, day: 12, year: 2000, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },
    { title: "에릭", group: "THE BOYZ", month: 12, day: 22, year: 2000, category: "KPOP", sourceUrl: sourceUrls["THE BOYZ"] },

    { title: "성호", group: "BOYNEXTDOOR", month: 9, day: 4, year: 2003, category: "KPOP", sourceUrl: sourceUrls.BOYNEXTDOOR },
    { title: "리우", group: "BOYNEXTDOOR", month: 10, day: 22, year: 2003, category: "KPOP", sourceUrl: sourceUrls.BOYNEXTDOOR },
    { title: "명재현", group: "BOYNEXTDOOR", month: 12, day: 4, year: 2003, category: "KPOP", sourceUrl: sourceUrls.BOYNEXTDOOR },
    { title: "태산", group: "BOYNEXTDOOR", month: 8, day: 10, year: 2004, category: "KPOP", sourceUrl: sourceUrls.BOYNEXTDOOR },
    { title: "이한", group: "BOYNEXTDOOR", month: 10, day: 20, year: 2004, category: "KPOP", sourceUrl: sourceUrls.BOYNEXTDOOR },
    { title: "운학", group: "BOYNEXTDOOR", month: 11, day: 29, year: 2006, category: "KPOP", sourceUrl: sourceUrls.BOYNEXTDOOR },

    { title: "마크", group: "NCT DREAM", month: 8, day: 2, year: 1999, category: "KPOP", sourceUrl: sourceUrls["NCT DREAM"] },
    { title: "런쥔", group: "NCT DREAM", month: 3, day: 23, year: 2000, category: "KPOP", sourceUrl: sourceUrls["NCT DREAM"] },
    { title: "제노", group: "NCT DREAM", month: 4, day: 23, year: 2000, category: "KPOP", sourceUrl: sourceUrls["NCT DREAM"] },
    { title: "해찬", group: "NCT DREAM", month: 6, day: 6, year: 2000, category: "KPOP", sourceUrl: sourceUrls["NCT DREAM"] },
    { title: "재민", group: "NCT DREAM", month: 8, day: 13, year: 2000, category: "KPOP", sourceUrl: sourceUrls["NCT DREAM"] },
    { title: "천러", group: "NCT DREAM", month: 11, day: 22, year: 2001, category: "KPOP", sourceUrl: sourceUrls["NCT DREAM"] },
    { title: "지성", group: "NCT DREAM", month: 2, day: 5, year: 2002, category: "KPOP", sourceUrl: sourceUrls["NCT DREAM"] },

    { title: "나연", group: "TWICE", month: 9, day: 22, year: 1995, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "정연", group: "TWICE", month: 11, day: 1, year: 1996, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "모모", group: "TWICE", month: 11, day: 9, year: 1996, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "사나", group: "TWICE", month: 12, day: 29, year: 1996, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "지효", group: "TWICE", month: 2, day: 1, year: 1997, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "미나", group: "TWICE", month: 3, day: 24, year: 1997, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "다현", group: "TWICE", month: 5, day: 28, year: 1998, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "채영", group: "TWICE", month: 4, day: 23, year: 1999, category: "KPOP", sourceUrl: sourceUrls.TWICE },
    { title: "쯔위", group: "TWICE", month: 6, day: 14, year: 1999, category: "KPOP", sourceUrl: sourceUrls.TWICE },

    { title: "지수", group: "BLACKPINK", month: 1, day: 3, year: 1995, category: "KPOP", sourceUrl: sourceUrls.BLACKPINK },
    { title: "제니", group: "BLACKPINK", month: 1, day: 16, year: 1996, category: "KPOP", sourceUrl: sourceUrls.BLACKPINK },
    { title: "로제", group: "BLACKPINK", month: 2, day: 11, year: 1997, category: "KPOP", sourceUrl: sourceUrls.BLACKPINK },
    { title: "리사", group: "BLACKPINK", month: 3, day: 27, year: 1997, category: "KPOP", sourceUrl: sourceUrls.BLACKPINK },

    { title: "아이린", group: "Red Velvet", month: 3, day: 29, year: 1991, category: "KPOP", sourceUrl: sourceUrls["Red Velvet"] },
    { title: "슬기", group: "Red Velvet", month: 2, day: 10, year: 1994, category: "KPOP", sourceUrl: sourceUrls["Red Velvet"] },
    { title: "웬디", group: "Red Velvet", month: 2, day: 21, year: 1994, category: "KPOP", sourceUrl: sourceUrls["Red Velvet"] },
    { title: "조이", group: "Red Velvet", month: 9, day: 3, year: 1996, category: "KPOP", sourceUrl: sourceUrls["Red Velvet"] },
    { title: "예리", group: "Red Velvet", month: 3, day: 5, year: 1999, category: "KPOP", sourceUrl: sourceUrls["Red Velvet"] },

    { title: "수민", group: "STAYC", month: 3, day: 13, year: 2001, category: "KPOP", sourceUrl: sourceUrls.STAYC },
    { title: "시은", group: "STAYC", month: 8, day: 1, year: 2001, category: "KPOP", sourceUrl: sourceUrls.STAYC },
    { title: "아이사", group: "STAYC", month: 1, day: 23, year: 2002, category: "KPOP", sourceUrl: sourceUrls.STAYC },
    { title: "세은", group: "STAYC", month: 6, day: 14, year: 2003, category: "KPOP", sourceUrl: sourceUrls.STAYC },
    { title: "윤", group: "STAYC", month: 4, day: 14, year: 2004, category: "KPOP", sourceUrl: sourceUrls.STAYC },
    { title: "재이", group: "STAYC", month: 12, day: 9, year: 2004, category: "KPOP", sourceUrl: sourceUrls.STAYC },

    { title: "솔라", group: "MAMAMOO", month: 2, day: 21, year: 1991, category: "KPOP", sourceUrl: sourceUrls.MAMAMOO },
    { title: "문별", group: "MAMAMOO", month: 12, day: 22, year: 1992, category: "KPOP", sourceUrl: sourceUrls.MAMAMOO },
    { title: "휘인", group: "MAMAMOO", month: 4, day: 17, year: 1995, category: "KPOP", sourceUrl: sourceUrls.MAMAMOO },
    { title: "화사", group: "MAMAMOO", month: 7, day: 23, year: 1995, category: "KPOP", sourceUrl: sourceUrls.MAMAMOO },

    { title: "시우민", group: "EXO", month: 3, day: 26, year: 1990, category: "KPOP", sourceUrl: sourceUrls.EXO },
    { title: "수호", group: "EXO", month: 5, day: 22, year: 1991, category: "KPOP", sourceUrl: sourceUrls.EXO },
    { title: "백현", group: "EXO", month: 5, day: 6, year: 1992, category: "KPOP", sourceUrl: sourceUrls.EXO },
    { title: "첸", group: "EXO", month: 9, day: 21, year: 1992, category: "KPOP", sourceUrl: sourceUrls.EXO },
    { title: "찬열", group: "EXO", month: 11, day: 27, year: 1992, category: "KPOP", sourceUrl: sourceUrls.EXO },
    { title: "디오", group: "EXO", month: 1, day: 12, year: 1993, category: "KPOP", sourceUrl: sourceUrls.EXO },
    { title: "카이", group: "EXO", month: 1, day: 14, year: 1994, category: "KPOP", sourceUrl: sourceUrls.EXO },
    { title: "세훈", group: "EXO", month: 4, day: 12, year: 1994, category: "KPOP", sourceUrl: sourceUrls.EXO },

    { title: "셔누", group: "MONSTA X", month: 6, day: 18, year: 1992, category: "KPOP", sourceUrl: sourceUrls["MONSTA X"] },
    { title: "민혁", group: "MONSTA X", month: 11, day: 3, year: 1993, category: "KPOP", sourceUrl: sourceUrls["MONSTA X"] },
    { title: "기현", group: "MONSTA X", month: 11, day: 22, year: 1993, category: "KPOP", sourceUrl: sourceUrls["MONSTA X"] },
    { title: "형원", group: "MONSTA X", month: 1, day: 15, year: 1994, category: "KPOP", sourceUrl: sourceUrls["MONSTA X"] },
    { title: "주헌", group: "MONSTA X", month: 10, day: 6, year: 1994, category: "KPOP", sourceUrl: sourceUrls["MONSTA X"] },
    { title: "아이엠", group: "MONSTA X", month: 1, day: 26, year: 1996, category: "KPOP", sourceUrl: sourceUrls["MONSTA X"] },

    { title: "성진", group: "DAY6", month: 1, day: 16, year: 1993, category: "KPOP", sourceUrl: sourceUrls.DAY6 },
    { title: "영케이", group: "DAY6", month: 12, day: 19, year: 1993, category: "KPOP", sourceUrl: sourceUrls.DAY6 },
    { title: "도운", group: "DAY6", month: 8, day: 25, year: 1995, category: "KPOP", sourceUrl: sourceUrls.DAY6 },
];

const animeItems: SeedItem[] = [
    { title: "몽키 D. 루피", group: "One Piece", month: 5, day: 5, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "롤로노아 조로", group: "One Piece", month: 11, day: 11, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "나미", group: "One Piece", month: 7, day: 3, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "우솝", group: "One Piece", month: 4, day: 1, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "상디", group: "One Piece", month: 3, day: 2, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "토니토니 쵸파", group: "One Piece", month: 12, day: 24, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "니코 로빈", group: "One Piece", month: 2, day: 6, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "프랑키", group: "One Piece", month: 3, day: 9, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "브룩", group: "One Piece", month: 4, day: 3, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },
    { title: "징베", group: "One Piece", month: 4, day: 2, category: "ANIME", sourceUrl: sourceUrls["One Piece"] },

    { title: "우즈마키 나루토", group: "Naruto", month: 10, day: 10, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "우치하 사스케", group: "Naruto", month: 7, day: 23, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "하루노 사쿠라", group: "Naruto", month: 3, day: 28, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "하타케 카카시", group: "Naruto", month: 9, day: 15, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "휴우가 히나타", group: "Naruto", month: 12, day: 27, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "나라 시카마루", group: "Naruto", month: 9, day: 22, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "가아라", group: "Naruto", month: 1, day: 19, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "우치하 이타치", group: "Naruto", month: 6, day: 9, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "지라이야", group: "Naruto", month: 11, day: 11, category: "ANIME", sourceUrl: sourceUrls.Naruto },
    { title: "츠나데", group: "Naruto", month: 8, day: 2, category: "ANIME", sourceUrl: sourceUrls.Naruto },

    { title: "카마도 탄지로", group: "Demon Slayer", month: 7, day: 14, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "카마도 네즈코", group: "Demon Slayer", month: 12, day: 28, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "아가츠마 젠이츠", group: "Demon Slayer", month: 9, day: 3, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "하시비라 이노스케", group: "Demon Slayer", month: 4, day: 22, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "토미오카 기유", group: "Demon Slayer", month: 2, day: 8, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "코쵸 시노부", group: "Demon Slayer", month: 2, day: 24, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "렌고쿠 쿄쥬로", group: "Demon Slayer", month: 5, day: 10, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "우즈이 텐겐", group: "Demon Slayer", month: 10, day: 31, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "칸로지 미츠리", group: "Demon Slayer", month: 6, day: 1, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },
    { title: "토키토 무이치로", group: "Demon Slayer", month: 8, day: 8, category: "ANIME", sourceUrl: sourceUrls["Demon Slayer"] },

    { title: "이타도리 유지", group: "Jujutsu Kaisen", month: 3, day: 20, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "후시구로 메구미", group: "Jujutsu Kaisen", month: 12, day: 22, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "쿠기사키 노바라", group: "Jujutsu Kaisen", month: 8, day: 7, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "고죠 사토루", group: "Jujutsu Kaisen", month: 12, day: 7, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "게토 스구루", group: "Jujutsu Kaisen", month: 2, day: 3, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "젠인 마키", group: "Jujutsu Kaisen", month: 1, day: 20, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "이누마키 토게", group: "Jujutsu Kaisen", month: 10, day: 23, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "판다", group: "Jujutsu Kaisen", month: 3, day: 5, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "나나미 켄토", group: "Jujutsu Kaisen", month: 7, day: 3, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },
    { title: "토도 아오이", group: "Jujutsu Kaisen", month: 9, day: 23, category: "ANIME", sourceUrl: sourceUrls["Jujutsu Kaisen"] },

    { title: "미도리야 이즈쿠", group: "My Hero Academia", month: 7, day: 15, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "바쿠고 카츠키", group: "My Hero Academia", month: 4, day: 20, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "우라라카 오챠코", group: "My Hero Academia", month: 12, day: 27, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "토도로키 쇼토", group: "My Hero Academia", month: 1, day: 11, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "이이다 텐야", group: "My Hero Academia", month: 8, day: 22, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "아스이 츠유", group: "My Hero Academia", month: 2, day: 12, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "키리시마 에이지로", group: "My Hero Academia", month: 10, day: 16, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "야오요로즈 모모", group: "My Hero Academia", month: 9, day: 23, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "올마이트", group: "My Hero Academia", month: 6, day: 10, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },
    { title: "아이자와 쇼타", group: "My Hero Academia", month: 11, day: 8, category: "ANIME", sourceUrl: sourceUrls["My Hero Academia"] },

    { title: "히나타 쇼요", group: "Haikyuu", month: 6, day: 21, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "카게야마 토비오", group: "Haikyuu", month: 12, day: 22, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "츠키시마 케이", group: "Haikyuu", month: 9, day: 27, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "야마구치 타다시", group: "Haikyuu", month: 11, day: 10, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "니시노야 유", group: "Haikyuu", month: 10, day: 10, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "타나카 류노스케", group: "Haikyuu", month: 3, day: 3, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "스가와라 코시", group: "Haikyuu", month: 6, day: 13, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "사와무라 다이치", group: "Haikyuu", month: 12, day: 31, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "오이카와 토오루", group: "Haikyuu", month: 7, day: 20, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },
    { title: "코즈메 켄마", group: "Haikyuu", month: 10, day: 16, category: "ANIME", sourceUrl: sourceUrls.Haikyuu },

    { title: "쿠로사키 이치고", group: "Bleach", month: 7, day: 15, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "쿠치키 루키아", group: "Bleach", month: 1, day: 14, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "이노우에 오리히메", group: "Bleach", month: 9, day: 3, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "이시다 우류", group: "Bleach", month: 11, day: 6, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "아바라이 렌지", group: "Bleach", month: 8, day: 31, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "쿠치키 뱌쿠야", group: "Bleach", month: 1, day: 31, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "히츠가야 토시로", group: "Bleach", month: 12, day: 20, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "마츠모토 란기쿠", group: "Bleach", month: 9, day: 29, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "자라키 켄파치", group: "Bleach", month: 11, day: 19, category: "ANIME", sourceUrl: sourceUrls.Bleach },
    { title: "시호인 요루이치", group: "Bleach", month: 1, day: 1, category: "ANIME", sourceUrl: sourceUrls.Bleach },

    { title: "에렌 예거", group: "Attack on Titan", month: 3, day: 30, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "미카사 아커만", group: "Attack on Titan", month: 2, day: 10, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "아르민 알레르토", group: "Attack on Titan", month: 11, day: 3, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "리바이 아커만", group: "Attack on Titan", month: 12, day: 25, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "엘빈 스미스", group: "Attack on Titan", month: 10, day: 14, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "한지 조에", group: "Attack on Titan", month: 9, day: 5, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "장 키르슈타인", group: "Attack on Titan", month: 4, day: 7, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "사샤 블라우스", group: "Attack on Titan", month: 7, day: 26, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "코니 스프링거", group: "Attack on Titan", month: 5, day: 2, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },
    { title: "라이너 브라운", group: "Attack on Titan", month: 8, day: 1, category: "ANIME", sourceUrl: sourceUrls["Attack on Titan"] },

    { title: "츠키노 우사기", group: "Sailor Moon", month: 6, day: 30, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "미즈노 아미", group: "Sailor Moon", month: 9, day: 10, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "히노 레이", group: "Sailor Moon", month: 4, day: 17, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "키노 마코토", group: "Sailor Moon", month: 12, day: 5, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "아이노 미나코", group: "Sailor Moon", month: 10, day: 22, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "치바 마모루", group: "Sailor Moon", month: 8, day: 3, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "치비우사", group: "Sailor Moon", month: 6, day: 30, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "텐오 하루카", group: "Sailor Moon", month: 1, day: 27, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "카이오 미치루", group: "Sailor Moon", month: 3, day: 6, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },
    { title: "토모에 호타루", group: "Sailor Moon", month: 1, day: 6, category: "ANIME", sourceUrl: sourceUrls["Sailor Moon"] },

    { title: "하나가키 타케미치", group: "Tokyo Revengers", month: 6, day: 25, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "사노 만지로", group: "Tokyo Revengers", month: 8, day: 20, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "류구지 켄", group: "Tokyo Revengers", month: 5, day: 10, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "마츠노 치후유", group: "Tokyo Revengers", month: 12, day: 19, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "바지 케이스케", group: "Tokyo Revengers", month: 11, day: 3, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "미츠야 타카시", group: "Tokyo Revengers", month: 6, day: 12, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "시바 핫카이", group: "Tokyo Revengers", month: 9, day: 4, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "타치바나 히나타", group: "Tokyo Revengers", month: 5, day: 21, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "타치바나 나오토", group: "Tokyo Revengers", month: 4, day: 12, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
    { title: "키사키 텟타", group: "Tokyo Revengers", month: 1, day: 20, category: "ANIME", sourceUrl: sourceUrls["Tokyo Revengers"] },
];

function createSlug(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function createEventSlug(item: SeedItem) {
    return `${createSlug(item.group)}-${createSlug(item.title)}-${item.month}-${item.day}`;
}

function getDescription(item: SeedItem) {
    if (item.category === "KPOP") {
        return `${item.group} 멤버 ${item.title}의 생일입니다.`;
    }

    return `${item.group} 캐릭터 ${item.title}의 생일입니다.`;
}

function getContentIdea(item: SeedItem) {
    if (item.category === "KPOP") {
        return `${item.title} 생일에는 ${item.group} 팬 콘텐츠, 생일 축하 게시물, 쇼츠 소재, 날짜 기반 검색 콘텐츠로 활용할 수 있습니다.`;
    }

    return `${item.title} 생일에는 ${item.group} 팬아트, 캐릭터 생일 축하 게시물, 만화·애니 콘텐츠 소재로 활용할 수 있습니다.`;
}

function getTags(item: SeedItem) {
    if (item.category === "KPOP") {
        return ["생일", "아이돌", "KPOP", item.group, item.title];
    }

    return ["생일", "애니", "만화", "캐릭터", item.group, item.title];
}

async function connectTags(eventId: string, tags: string[]) {
    for (const name of tags) {
        const tag = await prisma.tag.upsert({
            where: {
                name,
            },
            update: {},
            create: {
                name,
            },
        });

        const existingEventTag = await prisma.eventTag.findFirst({
            where: {
                eventId,
                tagId: tag.id,
            },
            select: {
                eventId: true,
            },
        });

        if (!existingEventTag) {
            await prisma.eventTag.create({
                data: {
                    eventId,
                    tagId: tag.id,
                },
            });
        }
    }
}

async function upsertSource(eventId: string, item: SeedItem) {
    const existingSource = await prisma.source.findFirst({
        where: {
            eventId,
            url: item.sourceUrl,
        },
        select: {
            id: true,
        },
    });

    if (existingSource) {
        return;
    }

    await prisma.source.create({
        data: {
            eventId,
            title: item.category === "KPOP" ? `${item.group} 프로필` : `${item.group} Wiki`,
            url: item.sourceUrl,
            type: "WIKI",
            verified: true,
        },
    });
}

async function upsertEvent(item: SeedItem) {
    const slug = createEventSlug(item);

    const event = await prisma.event.upsert({
        where: {
            slug,
        },
        update: {
            title: item.title,
            month: item.month,
            day: item.day,
            year: item.year ?? null,
            type: "BIRTHDAY",
            category: item.category,
            description: getDescription(item),
            contentIdea: getContentIdea(item),
            trustLevel: "SOURCE_VERIFIED",
            status: "PUBLISHED",
        },
        create: {
            title: item.title,
            slug,
            month: item.month,
            day: item.day,
            year: item.year ?? null,
            type: "BIRTHDAY",
            category: item.category,
            description: getDescription(item),
            contentIdea: getContentIdea(item),
            trustLevel: "SOURCE_VERIFIED",
            status: "PUBLISHED",
        },
    });

    await upsertSource(event.id, item);
    await connectTags(event.id, getTags(item));
}

async function main() {
    const items = [...idolItems, ...animeItems];

    console.log(`아이돌 추가 데이터: ${idolItems.length}개`);
    console.log(`애니/만화 캐릭터 추가 데이터: ${animeItems.length}개`);
    console.log(`총 추가 데이터: ${items.length}개`);

    for (const item of items) {
        await upsertEvent(item);
    }

    console.log("추가 seed 완료");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });