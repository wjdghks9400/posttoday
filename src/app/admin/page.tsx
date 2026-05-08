import Link from "next/link";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import { getEventStats } from "@/lib/mock/events";
import { mockSubmissions } from "@/lib/mock/submissions";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default function AdminPage() {
    const stats = getEventStats();
    const pendingCount = mockSubmissions.filter(
        (submission) => submission.status === "PENDING"
    ).length;

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <SectionTitle
                    eyebrow="Admin"
                    title="관리자 대시보드"
                    description="제보 검수, 소재 관리, 신고 처리를 위한 mock 관리자 화면입니다."
                />

                <div className="mb-6 flex justify-end">
                    <AdminLogoutButton/>
                </div>
                <div className="grid gap-5 md:grid-cols-4">
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">등록 소재</p>
                        <p className="mt-2 text-3xl font-black">{stats.total}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">공식 확인</p>
                        <p className="mt-2 text-3xl font-black">{stats.official}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">커뮤니티 기반</p>
                        <p className="mt-2 text-3xl font-black">{stats.community}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">승인 대기</p>
                        <p className="mt-2 text-3xl font-black">{pendingCount}</p>
                    </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    <Link
                        href="/admin/submissions"
                        className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <p className="text-sm font-semibold text-gray-500">Review</p>
                        <h2 className="mt-2 text-xl font-bold">제보 검수</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            신규 제보, 수정 제안, 출처 추가 요청을 확인합니다.
                        </p>
                    </Link>

                    <Link
                        href="/admin/events"
                        className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <p className="text-sm font-semibold text-gray-500">Events</p>
                        <h2 className="mt-2 text-xl font-bold">소재 관리</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            등록된 생일, 기념일, 밈, 팬덤 이벤트를 관리합니다.
                        </p>
                    </Link>

                    <div className="rounded-3xl border border-gray-100 bg-black p-6 text-white shadow-sm">
                        <p className="text-sm font-semibold text-gray-400">Policy</p>
                        <h2 className="mt-2 text-xl font-bold">검수 원칙</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-300">
                            출처 없는 생일, 비공개 개인정보, 추정 정보는 공개하지 않습니다.
                        </p>
                    </div>
                </div>
            </Container>
        </main>
    );
}