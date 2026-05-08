import { logoutAdmin } from "@/app/admin/login/actions";

export default function AdminLogoutButton() {
    return (
        <form action={logoutAdmin}>
            <button
                type="submit"
                className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
            >
                로그아웃
            </button>
        </form>
    );
}