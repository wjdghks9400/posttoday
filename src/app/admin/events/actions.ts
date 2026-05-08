"use server";

import { EventStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateEventStatus(eventId: string, status: EventStatus) {
    await prisma.event.update({
        where: {
            id: eventId,
        },
        data: {
            status,
        },
    });

    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/admin/events");
}