"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createAdInquiry(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const targetPage = String(formData.get("targetPage") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!email || !message) {
        redirect("/advertise?error=required");
    }

    if (!validateEmail(email)) {
        redirect("/advertise?error=email");
    }

    if (message.length > 2000) {
        redirect("/advertise?error=message");
    }

    await prisma.adInquiry.create({
        data: {
            email,
            targetPage: targetPage || null,
            message,
        },
    });

    revalidatePath("/advertise");
    revalidatePath("/admin");

    redirect("/advertise?success=1");
}