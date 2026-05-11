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
                                P
                            </div>
                            <div>
                                <p className="font-bold text-gray-950">오늘뭐올리지</p>
                                <p className="text-xs text-gray-500">
                                    생일·사건·밈 캘린더
                                </p>
                            </div>
                        </div>

                        <p className="max-w-md text-sm leading-6 text-gray-500">
                            유명인 생일, 인플루언서 생일, 애니/게임 캐릭터 생일,
                            사건, 역사, 밈, 팬덤 이벤트를 모아보는 캘린더형 위키
                            서비스입니다.
                        </p>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-950">서비스</p>
                        <div className="space-y-2 text-sm text-gray-500">
                            <Link href="/" className="block hover:text-black">
                                오늘 항목
                            </Link>
                            <Link href="/calendar" className="block hover:text-black">
                                캘린더
                            </Link>
                            <Link href="/search" className="block hover:text-black">
                                검색
                            </Link>
                            <Link href="/submit" className="block hover:text-black">
                                신규 항목 제보
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-950">비즈니스</p>
                        <div className="space-y-2 text-sm text-gray-500">
                            <Link href="/advertise" className="block hover:text-black">
                                광고/제휴 문의
                            </Link>
                            <p>상세 페이지 스폰서</p>
                            <p>카테고리 타겟 광고</p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-950">운영 정책</p>
                        <div className="space-y-2 text-sm text-gray-500">
                            <p>공개 출처 기반 등록</p>
                            <p>관리자 승인 후 공개</p>
                            <p>비공개 개인정보 등록 금지</p>
                            <p>광고성 제보 제한</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
                    <p>© 2026 posttoday. All rights reserved.</p>

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