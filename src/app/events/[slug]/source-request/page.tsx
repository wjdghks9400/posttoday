import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SourceRequestForm from "@/components/submit/SourceRequestForm";
import { getEventBySlugFromDb } from "@/lib/db/events";

interface SourceRequestPageProps {
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
                                       }: SourceRequestPageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = safeDecodeSlug(slug);

    return {
        title: `${decodedSlug} 출처 추가 - 오늘뭐올리지`,
        description: "기존 항목에 공개적으로 확인 가능한 출처를 추가 요청합니다.",
    };
}

export default async function SourceRequestPage({
                                                    params,
                                                }: SourceRequestPageProps) {
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
                        Source Request
                    </p>

                    <h1 className="text-3xl font-black text-gray-950">
                        출처 추가하기
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
                        이 항목을 확인할 수 있는 공식 프로필, 공식 홈페이지, 기사, 위키 등
                        공개 출처를 추가 요청할 수 있습니다. 승인되면 기존 항목의 출처에
                        추가됩니다.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <SourceRequestForm event={event} />

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                좋은 출처 기준
                            </h2>

                            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                                <li>공식 프로필이나 공식 홈페이지가 가장 좋습니다.</li>
                                <li>기사, 위키, SNS도 공개적으로 확인 가능하면 참고할 수 있습니다.</li>
                                <li>출처가 없는 추정 정보는 반영하지 않습니다.</li>
                                <li>이미 등록된 URL은 중복 추가되지 않습니다.</li>
                            </ul>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-black p-5 text-white shadow-sm">
                            <h2 className="text-lg font-black">좋은 출처 추가 예시</h2>

                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                “이 공식 프로필 링크에서 생일 날짜를 확인할 수 있습니다.”
                            </p>
                        </section>
                    </aside>
                </div>
            </Container>
        </main>
    );
}