import Link from "next/link";
import Container from "@/components/layout/Container";
import { getAdminDashboardStats } from "@/lib/db/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "@/app/admin/login/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    await requireAdmin();

    const stats = await getAdminDashboardStats();

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <div className="mb-10 flex items-start justify-between gap-6">
                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-500">
                            Admin
                        </p>

                        <h1 className="text-3xl font-black text-gray-950">
                            관리자 대시보드
                        </h1>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            제보 검수, 소재 관리, 광고 문의를 확인하는 관리자 화면입니다.
                        </p>
                    </div>

                    <form action={logoutAdmin}>
                        <button type="submit" className="btn-soft">
                            로그아웃
                        </button>
                    </form>
                </div>

                <section className="grid gap-4 md:grid-cols-5">
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            등록 소재
                        </p>

                        <p className="mt-4 text-3xl font-black text-gray-950">
                            {stats.totalEvents}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            공식 확인
                        </p>

                        <p className="mt-4 text-3xl font-black text-gray-950">
                            {stats.officialEvents}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            커뮤니티 기반
                        </p>

                        <p className="mt-4 text-3xl font-black text-gray-950">
                            {stats.communityEvents}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            승인 대기
                        </p>

                        <p className="mt-4 text-3xl font-black text-gray-950">
                            {stats.pendingSubmissions}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            한줄쓰기
                        </p>

                        <p className="mt-4 text-3xl font-black text-gray-950">
                            {stats.activeOneLines}
                        </p>
                    </div>
                </section>

                <section className="mt-8 grid gap-5 md:grid-cols-4">
                    <Link
                        href="/admin/submissions"
                        className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <p className="mb-4 text-sm font-semibold text-gray-500">
                            Review
                        </p>

                        <h2 className="text-2xl font-black text-gray-950">
                            제보 검수
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            신규 제보, 수정 제안, 출처 추가 요청을 확인합니다.
                        </p>
                    </Link>

                    <Link
                        href="/admin/events"
                        className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <p className="mb-4 text-sm font-semibold text-gray-500">
                            Events
                        </p>

                        <h2 className="text-2xl font-black text-gray-950">
                            소재 관리
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            등록된 생일, 기념일, 밈, 사건, 캐릭터 정보를 관리합니다.
                        </p>
                    </Link>

                    <Link
                        href="/admin/one-lines"
                        className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <p className="mb-4 text-sm font-semibold text-gray-500">
                            One-line
                        </p>

                        <h2 className="text-2xl font-black text-gray-950">
                            한줄쓰기 관리
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            상세 페이지에 남겨진 한줄을 확인하고 스팸성 글을 삭제합니다.
                        </p>
                    </Link>

                    <Link
                        href="/admin/events"
                        className="rounded-3xl border border-gray-100 bg-black p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <p className="mb-4 text-sm font-semibold text-gray-400">
                            Manage
                        </p>

                        <h2 className="text-2xl font-black text-white">
                            직접 수정
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-gray-300">
                            승인된 소재의 제목, 날짜, 설명, 공개 상태, 출처를 직접 수정합니다.
                        </p>
                    </Link>
                </section>

                <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="mb-3 text-sm font-bold text-gray-500">
                        운영 원칙
                    </p>

                    <h2 className="text-2xl font-black text-gray-950">
                        검수 기준
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-gray-500">
                        출처 없는 생일, 비공개 개인정보, 추정 정보는 공개하지 않습니다.
                        수정 제안은 자동 반영하지 않고, 관리자가 소재 관리 화면에서 직접 확인 후 수정합니다.
                    </p>
                </section>
            </Container>
        </main>
    );
}