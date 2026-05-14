import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "오늘뭐올리지 - 이벤트 캘린더",
    description:
        "오늘 생일, 기념일, 밈, 팬덤 이벤트를 한눈에 확인하세요.",
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