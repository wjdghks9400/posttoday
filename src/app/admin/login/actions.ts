"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
    const password = String(formData.get("password") ?? "");

    if (password !== process.env.ADMIN_PASSWORD) {
        redirect("/admin/login?error=1");
    }

    const cookieStore = await cookies();

    cookieStore.set("posttoday_admin", "ok", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    redirect("/admin");
}

export async function logoutAdmin() {
    const cookieStore = await cookies();

    cookieStore.delete("posttoday_admin");

    redirect("/");
}