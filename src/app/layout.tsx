import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tadaylab.today";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "TadayLab - 생일·사건·기념일 기록장",
        template: "%s | TadayLab",
    },
    description:
        "TadayLab은 생일, 사건, 사고, 기념일, 인터넷 대첩, 밈성 날짜를 모아두는 B급 날짜 기록장입니다.",
    keywords: [
        "생일",
        "생일 검색",
        "오늘 생일",
        "연예인 생일",
        "유명인 생일",
        "아이돌 생일",
        "기념일",
        "오늘 기념일",
        "10주년",
        "데뷔일",
        "사건 사고",
        "인터넷 대첩",
        "밈",
        "오늘 무슨 날",
        "날짜별 사건",
        "날짜별 기념일",
        "K-POP 생일",
        "게임 출시일",
        "애니 기념일",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "TadayLab - 생일·사건·기념일 기록장",
        description:
            "생일, 사건, 사고, 기념일, 인터넷 대첩, 밈성 날짜를 모아두는 B급 날짜 기록장.",
        url: "/",
        siteName: "TadayLab",
        locale: "ko_KR",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body>
        <Header />
        {children}
        <Footer />
        </body>
        </html>
    );
}