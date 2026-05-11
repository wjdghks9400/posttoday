import Link from "next/link";
import Container from "@/components/layout/Container";
import { createAdInquiry } from "@/app/advertise/actions";

interface AdvertisePageProps {
    searchParams?: Promise<{
        success?: string;
        error?: string;
    }>;
}

function getErrorMessage(error?: string) {
    if (error === "required") {
        return "이메일과 문의 내용은 필수입니다.";
    }

    if (error === "email") {
        return "올바른 이메일을 입력해주세요.";
    }

    if (error === "message") {
        return "문의 내용은 2000자 이하로 입력해주세요.";
    }

    return null;
}

export default async function AdvertisePage({
                                                searchParams,
                                            }: AdvertisePageProps) {
    const resolvedSearchParams = await searchParams;
    const success = resolvedSearchParams?.success === "1";
    const errorMessage = getErrorMessage(resolvedSearchParams?.error);

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <section className="mb-10 rounded-[2rem] bg-black p-8 text-white md:p-12">
                    <p className="mb-4 text-sm font-bold text-white/60">
                        Advertising & Partnership
                    </p>

                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                            광고/제휴 문의
                        </h1>

                        <p className="mt-5 text-base leading-7 text-white/70">
                            생일, 사건, 밈, 팬덤 이벤트, 캐릭터 생일 페이지와 어울리는
                            광고나 제휴를 문의할 수 있습니다.
                        </p>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-gray-950">
                                문의 남기기
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                현재는 자동 결제 광고 시스템을 운영하지 않습니다.
                                문의를 남겨주시면 운영자가 확인 후 이메일로 답변합니다.
                            </p>
                        </div>

                        {success && (
                            <div className="mb-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
                                광고/제휴 문의가 접수되었습니다. 확인 후 이메일로 연락드리겠습니다.
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                                {errorMessage}
                            </div>
                        )}

                        <form action={createAdInquiry} className="grid gap-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    이메일
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="contact@example.com"
                                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    광고하고 싶은 페이지
                                </label>

                                <input
                                    name="targetPage"
                                    placeholder="예: 페이커 생일 페이지, e스포츠 카테고리, 5월 7일 날짜 페이지"
                                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                />

                                <p className="mt-2 text-xs leading-5 text-gray-400">
                                    특정 페이지가 없다면 비워두셔도 됩니다.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    문의 내용
                                </label>

                                <textarea
                                    name="message"
                                    required
                                    rows={9}
                                    placeholder="광고하고 싶은 상품, 원하는 노출 위치, 기간, 예산, 타겟 페이지 등을 자유롭게 적어주세요."
                                    className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none focus:border-black"
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full">
                                문의 보내기
                            </button>
                        </form>
                    </section>

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                가능한 광고 위치
                            </h2>

                            <div className="mt-4 space-y-4 text-sm leading-6 text-gray-500">
                                <div>
                                    <p className="font-bold text-gray-950">
                                        상세 페이지 스폰서
                                    </p>
                                    <p className="mt-1">
                                        특정 생일, 사건, 캐릭터, 밈 페이지 오른쪽 영역에
                                        노출되는 광고입니다.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-gray-950">
                                        카테고리 기반 광고
                                    </p>
                                    <p className="mt-1">
                                        e스포츠, 게임, 애니, K-POP, 밈 등 관심 분야에 맞춘
                                        광고를 검토할 수 있습니다.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-gray-950">
                                        날짜/이벤트 기반 광고
                                    </p>
                                    <p className="mt-1">
                                        특정 날짜, 생일 주간, 팬덤 이벤트 기간에 맞춘 광고를
                                        검토할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                잘 맞는 광고 예시
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {[
                                    "팬덤 이벤트",
                                    "생일카페",
                                    "굿즈샵",
                                    "게임 이벤트",
                                    "애니 행사",
                                    "디자인툴",
                                    "숏폼 편집툴",
                                    "브랜드 캠페인",
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-3xl bg-black p-5 text-white shadow-sm">
                            <h2 className="text-lg font-black">운영 원칙</h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-white/70">
                                <p>
                                    특정 인물이나 캐릭터가 공식적으로 보증하는 것처럼 보이는
                                    광고는 받지 않습니다.
                                </p>

                                <p>
                                    페이지 주제와 지나치게 무관한 광고는 노출하지 않을 수 있습니다.
                                </p>

                                <p>
                                    실제 광고 노출은 트래픽, 위치, 기간에 따라 협의합니다.
                                </p>
                            </div>
                        </section>

                        <Link href="/" className="btn-secondary w-full">
                            홈으로 돌아가기
                        </Link>
                    </aside>
                </div>
            </Container>
        </main>
    );
}

