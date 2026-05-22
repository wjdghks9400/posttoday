import { hideEvent, publishEvent } from "@/app/admin/events/actions";

interface EventAdminButtonsProps {
    eventId: string;
    status: "DRAFT" | "PUBLISHED" | "HIDDEN";
}

export default function EventAdminButtons({
                                              eventId,
                                              status,
                                          }: EventAdminButtonsProps) {
    return (
        <div className="flex items-center gap-2">
            {status !== "PUBLISHED" ? (
                <form action={publishEvent}>
                    <input type="hidden" name="eventId" value={eventId} />
                    <button
                        type="submit"
                        className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                    >
                        공개
                    </button>
                </form>
            ) : null}

            {status !== "HIDDEN" ? (
                <form action={hideEvent}>
                    <input type="hidden" name="eventId" value={eventId} />
                    <button
                        type="submit"
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                        숨김
                    </button>
                </form>
            ) : null}
        </div>
    );
}