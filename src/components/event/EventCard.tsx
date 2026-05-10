import Link from "next/link";
import { CalendarEvent } from "@/types/event";
import TrustBadge from "@/components/event/TrustBadge";
import {
    calendarEventCategoryLabelMap,
    eventTypeEmojiMap,
    eventTypeLabelMap,
} from "@/lib/event-options";
import { formatMonthDay } from "@/lib/date";

interface EventCardProps {
    event: CalendarEvent;
}

export default function EventCard({ event }: EventCardProps) {
    return (
        <article className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                    {eventTypeEmojiMap[event.type]} {eventTypeLabelMap[event.type]}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                    {calendarEventCategoryLabelMap[event.category]}
                </span>

                <TrustBadge trustLevel={event.trustLevel} />
            </div>

            <h3 className="text-lg font-black tracking-tight text-gray-950">
                {event.title}
            </h3>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                {event.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="rounded-full bg-gray-50 px-3 py-1">
                    {formatMonthDay(event.month, event.day)}
                </span>

                <span className="rounded-full bg-gray-50 px-3 py-1">
                    출처 {event.sources.length}개
                </span>
            </div>

            <div className="mt-auto pt-5">
                <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex text-sm font-bold text-gray-950 hover:underline"
                >
                    자세히 보기 →
                </Link>
            </div>
        </article>
    );
}