"use client";

import { useFormStatus } from "react-dom";
import {
    deleteEvent,
    hideEvent,
    publishEvent,
} from "@/app/admin/events/actions";

interface EventActionButtonsProps {
    eventId: string;
    status: string;
}

function ActionButton({
                          children,
                          className,
                      }: {
    children: React.ReactNode;
    className: string;
}) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending} className={className}>
            {pending ? "처리 중..." : children}
        </button>
    );
}

export default function EventActionButtons({
                                               eventId,
                                               status,
                                           }: EventActionButtonsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {status === "PUBLISHED" ? (
                <form action={hideEvent}>
                    <input type="hidden" name="eventId" value={eventId} />
                    <ActionButton className="btn-soft h-10 rounded-xl px-4 disabled:opacity-50">
                        숨김
                    </ActionButton>
                </form>
            ) : (
                <form action={publishEvent}>
                    <input type="hidden" name="eventId" value={eventId} />
                    <ActionButton className="btn-primary h-10 rounded-xl px-4 disabled:opacity-50">
                        공개
                    </ActionButton>
                </form>
            )}

            <form action={deleteEvent}>
                <input type="hidden" name="eventId" value={eventId} />
                <ActionButton className="inline-flex h-10 items-center justify-center rounded-xl bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50">
                    삭제
                </ActionButton>
            </form>
        </div>
    );
}