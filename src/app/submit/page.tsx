import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import SubmissionForm from "@/components/submit/SubmissionForm";

export const metadata: Metadata = {
    title: "소재 제보하기 - 오늘뭐올리지",
    description:
        "생일, 기념일, 밈, 팬덤 이벤트 등 콘텐츠 소재를 제보해주세요.",
};

export default function SubmitPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <SectionTitle
                    title="소재 제보하기"
                    description="잘못된 정보 수정, 새로운 생일·기념일·밈·팬덤 이벤트를 제보해주세요. 관리자가 검수 후 반영합니다."
                />

                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <SubmissionForm />

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-950">
                                제보 전 확인해주세요
                            </h2>

                            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                                <li>공개적으로 확인 가능한 출처를 함께 적어주세요.</li>
                                <li>개인의 비공개 생일이나 사적인 정보는 등록하지 않습니다.</li>
                                <li>밈과 커뮤니티 이슈는 날짜가 불확실할 수 있습니다.</li>
                                <li>관리자 검수 후 공개 여부가 결정됩니다.</li>
                            </ul>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-black p-5 text-white shadow-sm">
                            <h2 className="text-lg font-bold">좋은 제보 예시</h2>

                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                “5월 7일은 ○○ 기념일입니다. 공식 홈페이지 또는 기사에서
                                확인할 수 있습니다.”
                            </p>
                        </section>
                    </aside>
                </div>
            </Container>
        </main>
    );
}