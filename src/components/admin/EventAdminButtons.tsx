"use client";

import { useTransition } from "react";
import Link from "next/link";
import { EventStatus } from "@prisma/client";
import { updateEventStatus } from "@/app/admin/events/actions";

interface EventAdminButtonsProps {
    eventId: string;
    slug: string;
    status: EventStatus;
}

export default function EventAdminButtons({
                                              eventId,
                                              slug,
                                              status,
                                          }: EventAdminButtonsProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex gap-2">
            <Link
                href={`/events/${slug}`}
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700"
            >
                보기
            </Link>

            {status === "PUBLISHED" ? (
                <button
                    disabled={isPending}
                    onClick={() => {
                        startTransition(() => {
                            updateEventStatus(eventId, "HIDDEN");
                        });
                    }}
                    className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-white disabled:bg-gray-400"
                >
                    숨김
                </button>
            ) : (
                <button
                    disabled={isPending}
                    onClick={() => {
                        startTransition(() => {
                            updateEventStatus(eventId, "PUBLISHED");
                        });
                    }}
                    className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-white disabled:bg-gray-400"
                >
                    공개
                </button>
            )}
        </div>
    );
}