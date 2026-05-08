import { CalendarEvent } from "@/types/event";
import EventCard from "./EventCard";

interface EventListProps {
    events: CalendarEvent[];
}

export default function EventList({ events }: EventListProps) {
    if (events.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-gray-200 p-10 text-center">
                <p className="text-sm text-gray-500">아직 등록된 소재가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}