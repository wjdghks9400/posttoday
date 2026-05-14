"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

function getSafeNextUrl(value: FormDataEntryValue | null) {
    const nextUrl = String(value ?? "").trim();

    if (!nextUrl) {
        return "/admin";
    }

    if (!nextUrl.startsWith("/admin")) {
        return "/admin";
    }

    if (nextUrl.startsWith("/admin/login")) {
        return "/admin";
    }

    return nextUrl;
}

export async function loginAdmin(formData: FormData) {
    const password = String(formData.get("password") ?? "").trim();
    const nextUrl = getSafeNextUrl(formData.get("next"));

    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    const adminSessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();

    if (!adminPassword || !adminSessionSecret) {
        redirect("/admin/login?error=config");
    }

    if (password !== adminPassword) {
        redirect("/admin/login?error=invalid");
    }

    const cookieStore = await cookies();

    cookieStore.set({
        name: ADMIN_COOKIE_NAME,
        value: adminSessionSecret,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    redirect(nextUrl);
}

export async function logoutAdmin() {
    const cookieStore = await cookies();

    cookieStore.delete(ADMIN_COOKIE_NAME);

    redirect("/admin/login");
}