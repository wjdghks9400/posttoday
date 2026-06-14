"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function deleteOneLine(formData: FormData) {
    await requireAdmin();

    const oneLineId = String(formData.get("oneLineId") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();

    if (!oneLineId) {
        redirect("/admin/one-lines");
    }

    await prisma.oneLine.update({
        where: {
            id: oneLineId,
        },
        data: {
            deletedAt: new Date(),
        },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/one-lines");

    if (slug) {
        revalidatePath(`/events/${encodeURIComponent(slug)}`);
    }

    redirect("/admin/one-lines");
}
