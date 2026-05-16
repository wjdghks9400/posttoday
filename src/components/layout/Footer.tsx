import Link from "next/link";
import Container from "./Container";

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <Container className="py-10">
                <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                                T
                            </div>

                            <div>
                                <p className="font-bold text-gray-950">TadayLab</p>
                                <p className="text-xs text-gray-500">
                                    생일·기념일 검색 캘린더
                                </p>
                            </div>
                        </div>

                        <p className="max-w-md text-sm leading-6 text-gray-500">
                            TadayLab은 공개 출처를 기반으로 날짜별 생일, 기념일,
                            역사적 사건, K-POP, 게임, 애니, 브랜드 기념일을 검색할 수
                            있는 캘린더형 정보 서비스입니다.
                        </p>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-950">서비스</p>

                        <div className="space-y-2 text-sm text-gray-500">
                            <Link href="/" className="block hover:text-black">
                                오늘 생일·기념일
                            </Link>
                            <Link href="/calendar" className="block hover:text-black">
                                날짜별 캘린더
                            </Link>
                            <Link href="/search" className="block hover:text-black">
                                생일·기념일 검색
                            </Link>
                            <Link href="/submit" className="block hover:text-black">
                                신규 항목 제보
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-950">검색 주제</p>

                        <div className="space-y-2 text-sm text-gray-500">
                            <p>오늘 생일</p>
                            <p>오늘 기념일</p>
                            <p>날짜별 생일</p>
                            <p>날짜별 기념일</p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-950">운영 정책</p>

                        <div className="space-y-2 text-sm text-gray-500">
                            <p>공개 출처 기반 등록</p>
                            <p>관리자 승인 후 공개</p>
                            <p>비공개 개인정보 등록 금지</p>
                            <p>수정 제안 검수 후 반영</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
                    <p>© 2026 TadayLab. All rights reserved.</p>

                    <div className="flex gap-4">
                        <Link href="/advertise" className="hover:text-gray-700">
                            광고/제휴 문의
                        </Link>
                        <Link href="/submit" className="hover:text-gray-700">
                            제보하기
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}