import Link from "next/link";
import Container from "./Container";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                            T
                        </div>

                        <div>
                            <div className="text-base font-bold tracking-tight">
                                TadayLab
                            </div>
                            <div className="text-xs text-gray-500">
                                생일·기념일 검색 캘린더
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
                        <Link href="/" className="hover:text-black">
                            오늘
                        </Link>
                        <Link href="/birthdays" className="hover:text-black">
                            생일
                        </Link>
                        <Link href="/calendar" className="hover:text-black">
                            캘린더
                        </Link>
                        <Link href="/search" className="hover:text-black">
                            검색
                        </Link>
                        <Link href="/submit" className="hover:text-black">
                            제보하기
                        </Link>
                    </nav>
                </div>
            </Container>
        </header>
    );
}