import { CalendarEvent } from "@/types/event";
import { formatMonthDay } from "@/lib/date";

interface MiniCalendarProps {
    events: CalendarEvent[];
}

const weekLabels = ["오늘", "+1일", "+2일", "+3일", "+4일", "+5일", "+6일"];

export default function MiniCalendar({ events }: MiniCalendarProps) {
    return (
        <div className="grid gap-3 md:grid-cols-7">
            {events.map((event, index) => (
                <div
                    key={event.id}
                    className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                    <p className="mb-2 text-xs font-semibold text-gray-400">
                        {weekLabels[index] ?? "예정"}
                    </p>
                    <p className="mb-3 text-sm font-bold text-gray-950">
                        {formatMonthDay(event.month, event.day)}
                    </p>
                    <p className="line-clamp-2 text-sm leading-5 text-gray-600">
                        {event.title}
                    </p>
                </div>
            ))}
        </div>
    );
}