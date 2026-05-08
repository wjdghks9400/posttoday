import Container from "@/components/layout/Container";
import { loginAdmin } from "./actions";

interface AdminLoginPageProps {
    searchParams: Promise<{
        error?: string;
    }>;
}

export default async function AdminLoginPage({
                                                 searchParams,
                                             }: AdminLoginPageProps) {
    const { error } = await searchParams;

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="flex min-h-screen items-center justify-center py-12">
                <form
                    action={loginAdmin}
                    className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
                >
                    <p className="mb-2 text-sm font-semibold text-gray-500">Admin</p>
                    <h1 className="text-2xl font-black text-gray-950">관리자 로그인</h1>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        제보 검수와 소재 관리는 관리자만 접근할 수 있습니다.
                    </p>

                    {error && (
                        <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                            비밀번호가 올바르지 않습니다.
                        </div>
                    )}

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            관리자 비밀번호
                        </label>
                        <input
                            name="password"
                            type="password"
                            className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 h-12 w-full rounded-2xl bg-black text-sm font-bold text-white transition hover:bg-gray-800"
                    >
                        로그인
                    </button>
                </form>
            </Container>
        </main>
    );
}