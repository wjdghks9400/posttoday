import { loginAdmin } from "./actions";

type AdminLoginPageProps = {
    searchParams: Promise<{
        error?: string;
        next?: string;
    }>;
};

function getSafeNextUrl(next?: string) {
    if (!next) {
        return "/admin";
    }

    if (!next.startsWith("/admin")) {
        return "/admin";
    }

    if (next.startsWith("/admin/login")) {
        return "/admin";
    }

    return next;
}

export default async function AdminLoginPage({
                                                 searchParams,
                                             }: AdminLoginPageProps) {
    const params = await searchParams;

    const error = params.error;
    const nextUrl = getSafeNextUrl(params.next);

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-16">
            <section className="mx-auto max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <p className="text-sm text-neutral-500">Posttoday Admin</p>
                    <h1 className="mt-1 text-2xl font-semibold text-neutral-950">
                        관리자 로그인
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        관리자 비밀번호를 입력하면 관리 페이지로 이동합니다.
                    </p>
                </div>

                <form action={loginAdmin} className="space-y-4">
                    <input type="hidden" name="next" value={nextUrl} />

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-neutral-700"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-950"
                            placeholder="관리자 비밀번호"
                        />
                    </div>

                    {error === "invalid" ? (
                        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            비밀번호가 올바르지 않습니다.
                        </p>
                    ) : null}

                    {error === "config" ? (
                        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            관리자 환경변수가 설정되지 않았습니다.
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                    >
                        로그인
                    </button>
                </form>
            </section>
        </main>
    );
}