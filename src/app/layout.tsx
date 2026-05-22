import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tadaylab.today";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "TadayLab - 생일·기념일 검색 캘린더",
        template: "%s | TadayLab",
    },
    description:
        "TadayLab은 날짜별 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 기념일을 검색할 수 있는 캘린더입니다.",
    keywords: [
        "생일 검색",
        "기념일 검색",
        "오늘 생일",
        "오늘 기념일",
        "오늘 무슨 날",
        "날짜별 생일",
        "날짜별 기념일",
        "연예인 생일",
        "아이돌 생일",
        "K-POP 생일",
        "게임 출시일",
        "애니 기념일",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "TadayLab - 생일·기념일 검색 캘린더",
        description:
            "날짜별 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 기념일을 검색하세요.",
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