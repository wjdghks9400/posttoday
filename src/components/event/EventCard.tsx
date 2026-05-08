import Link from "next/link";
import { CalendarEvent } from "@/types/event";
import { formatMonthDay } from "@/lib/date";
import TrustBadge from "./TrustBadge";

interface EventCardProps {
    event: CalendarEvent;
}

const typeLabelMap: Record<CalendarEvent["type"], string> = {
    BIRTHDAY: "생일",
    ANNIVERSARY: "기념일",
    MEME: "밈",
    FANDOM: "팬덤",
    HISTORY: "역사",
    BRAND: "브랜드",
};

const typeEmojiMap: Record<CalendarEvent["type"], string> = {
    BIRTHDAY: "🎂",
    ANNIVERSARY: "🎉",
    MEME: "🔥",
    FANDOM: "💜",
    HISTORY: "📚",
    BRAND: "📢",
};

export default function EventCard({ event }: EventCardProps) {
    return (
        <article className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {typeEmojiMap[event.type]} {typeLabelMap[event.type]}
            </span>
                        <TrustBadge trustLevel={event.trustLevel} />
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-gray-950 group-hover:underline">
                        {event.title}
                    </h3>
                </div>

                <div className="shrink-0 rounded-2xl bg-gray-950 px-3 py-2 text-center text-xs font-semibold text-white">
                    {formatMonthDay(event.month, event.day)}
                </div>
            </div>

            <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
                {event.description}
            </p>

            <div className="mb-4 rounded-2xl bg-gray-50 p-4">
                <p className="mb-1 text-xs font-semibold text-gray-500">
                    콘텐츠 아이디어
                </p>
                <p className="text-sm leading-6 text-gray-800">{event.contentIdea}</p>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-500 ring-1 ring-gray-200"
                    >
            #{tag}
          </span>
                ))}
            </div>

            <Link
                href={`/events/${event.slug}`}
                className="inline-flex text-sm font-semibold text-gray-950 hover:underline"
            >
                자세히 보기
            </Link>
        </article>
    );
}