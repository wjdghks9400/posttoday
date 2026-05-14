import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "posttoday_admin_session";

export async function requireAdmin() {
    const adminSessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();

    if (!adminSessionSecret) {
        redirect("/admin/login?error=config");
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (sessionCookie !== adminSessionSecret) {
        redirect("/admin/login");
    }
}