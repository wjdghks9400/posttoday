import OneLineForm from "@/components/event/OneLineForm";
import { EventOneLine } from "@/lib/db/one-lines";

interface OneLineSectionProps {
    eventId: string;
    slug: string;
    oneLines: EventOneLine[];
}

function formatOneLineDate(date: Date) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function OneLineSection({
    eventId,
    slug,
    oneLines,
}: OneLineSectionProps) {
    return (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm font-bold text-gray-500">
                One-line
            </p>

            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-950">
                        한줄쓰기
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                    </p>
                </div>

                <p className="text-sm font-bold text-gray-400">
                    {oneLines.length}개
                </p>
            </div>

            <OneLineForm eventId={eventId} slug={slug} />

            <div className="mt-6 space-y-3">
                {oneLines.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
                        <p className="text-sm font-semibold text-gray-500">
                            아직 남겨진 한줄이 없습니다. 첫 한줄을 남겨보세요.
                        </p>
                    </div>
                ) : (
                    oneLines.map((oneLine) => (
                        <article
                            key={oneLine.id}
                            className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                        >
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400">
                                <span className="text-gray-700">
                                    {oneLine.nickname || "익명"}
                                </span>
                                <span>·</span>
                                <time dateTime={oneLine.createdAt.toISOString()}>
                                    {formatOneLineDate(oneLine.createdAt)}
                                </time>
                            </div>

                            <p className="break-words text-sm leading-6 text-gray-700">
                                {oneLine.body}
                            </p>
                        </article>
                    ))
                )}
            </div>

            <p className="mt-5 text-xs leading-5 text-gray-400">
                링크, 광고, 도배성 한줄은 예고 없이 삭제될 수 있습니다.
            </p>
        </section>
    );
}
