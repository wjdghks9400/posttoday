import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import EditRequestForm from "@/components/submit/EditRequestForm";
import { getEventBySlugFromDb } from "@/lib/db/events";

interface EditRequestPageProps {
    params: Promise<{
        slug: string;
    }>;
}

function safeDecodeSlug(slug: string) {
    try {
        return decodeURIComponent(slug);
    } catch {
        return slug;
    }
}

export async function generateMetadata({
                                           params,
                                       }: EditRequestPageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = safeDecodeSlug(slug);

    return {
        title: `${decodedSlug} 수정 제안 - 오늘뭐올리지`,
        description: "기존 항목의 잘못된 정보에 대한 수정 제안을 보냅니다.",
    };
}

export default async function EditRequestPage({ params }: EditRequestPageProps) {
    const { slug } = await params;
    const decodedSlug = safeDecodeSlug(slug);

    const event = await getEventBySlugFromDb(decodedSlug);

    if (!event) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <Link
                    href={`/events/${event.slug}`}
                    className="mb-8 inline-flex text-sm font-bold text-gray-500 hover:text-black"
                >
                    ← 항목으로 돌아가기
                </Link>

                <div className="mb-8">
                    <p className="mb-3 text-sm font-bold text-gray-500">
                        Edit Request
                    </p>

                    <h1 className="text-3xl font-black text-gray-950">
                        수정 제안하기
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
                        이 항목의 날짜, 설명, 출처, 분류 등에 잘못된 부분이 있다면
                        알려주세요. 승인되어도 실제 항목 내용은 자동 변경되지 않고,
                        관리자가 직접 확인 후 수정합니다.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <EditRequestForm event={event} />

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                수정 제안 기준
                            </h2>

                            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                                <li>정확한 근거가 있는 내용을 적어주세요.</li>
                                <li>개인 추정이나 확인되지 않은 정보는 반영하지 않습니다.</li>
                                <li>제안 승인과 실제 항목 수정은 별도입니다.</li>
                                <li>실제 수정은 관리자가 소재 관리 화면에서 직접 처리합니다.</li>
                            </ul>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-black p-5 text-white shadow-sm">
                            <h2 className="text-lg font-black">좋은 수정 제안 예시</h2>

                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                “현재 설명에는 ○○라고 되어 있지만, 공식 프로필 기준으로는
                                △△입니다. 아래 출처에서 확인할 수 있습니다.”
                            </p>
                        </section>
                    </aside>
                </div>
            </Container>
        </main>
    );
}