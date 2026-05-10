import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import SubmissionForm from "@/components/submit/SubmissionForm";

export const metadata: Metadata = {
    title: "신규 항목 제보하기 - 오늘뭐올리지",
    description:
        "생일, 사건, 역사, 밈, 팬덤 이벤트, 캐릭터 생일 등 새 항목을 제보해주세요.",
};

export default function SubmitPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <SectionTitle
                    title="신규 항목 제보하기"
                    description="아직 등록되지 않은 생일, 사건, 역사, 밈, 팬덤 이벤트, 캐릭터 생일을 제보해주세요."
                />

                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <SubmissionForm />

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                이 화면은 신규 제보 전용입니다
                            </h2>

                            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                                <li>이미 등록된 항목의 수정은 상세 페이지에서 제안해주세요.</li>
                                <li>이미 등록된 항목의 출처 추가도 상세 페이지에서 요청해주세요.</li>
                                <li>비공개 생일, 추정 생일, 사적인 정보는 등록하지 않습니다.</li>
                                <li>공개적으로 확인 가능한 출처가 있으면 함께 입력해주세요.</li>
                            </ul>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-black p-5 text-white shadow-sm">
                            <h2 className="text-lg font-black">좋은 제보 예시</h2>

                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                “5월 7일은 ○○ 생일입니다. 공식 프로필 또는 기사에서
                                날짜를 확인할 수 있습니다.”
                            </p>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                기존 항목을 수정하고 싶나요?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                기존 항목 수정 제안과 출처 추가는 해당 항목 상세 페이지에서
                                진행해주세요.
                            </p>

                            <Link href="/search" className="btn-secondary mt-5">
                                기존 항목 검색하기
                            </Link>
                        </section>
                    </aside>
                </div>
            </Container>
        </main>
    );
}