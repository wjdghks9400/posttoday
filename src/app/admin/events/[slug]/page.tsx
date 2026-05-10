import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import {
    addEventSource,
    deleteEventSource,
    updateEvent,
} from "@/app/admin/events/actions";
import { getAdminEventBySlug } from "@/lib/db/admin-events";
import {
    eventCategoryOptions,
    eventTypeOptions,
    eventTypeLabelMap,
    eventCategoryLabelMap,
} from "@/lib/event-options";
import { formatMonthDay } from "@/lib/date";

interface AdminEventEditPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const dynamic = "force-dynamic";

const trustLevelOptions = [
    {
        label: "공식 확인",
        value: "OFFICIAL",
    },
    {
        label: "출처 확인",
        value: "SOURCE_VERIFIED",
    },
    {
        label: "커뮤니티 기반",
        value: "COMMUNITY",
    },
    {
        label: "불확실",
        value: "UNCERTAIN",
    },
];

const statusOptions = [
    {
        label: "공개",
        value: "PUBLISHED",
    },
    {
        label: "숨김",
        value: "HIDDEN",
    },
    {
        label: "초안",
        value: "DRAFT",
    },
];

const sourceTypeOptions = [
    {
        label: "공식",
        value: "OFFICIAL",
    },
    {
        label: "뉴스",
        value: "NEWS",
    },
    {
        label: "위키",
        value: "WIKI",
    },
    {
        label: "커뮤니티",
        value: "COMMUNITY",
    },
    {
        label: "SNS",
        value: "SNS",
    },
];

function safeDecodeSlug(slug: string) {
    try {
        return decodeURIComponent(slug);
    } catch {
        return slug;
    }
}

export default async function AdminEventEditPage({
                                                     params,
                                                 }: AdminEventEditPageProps) {
    const { slug } = await params;
    const decodedSlug = safeDecodeSlug(slug);

    const event = await getAdminEventBySlug(decodedSlug);

    if (!event) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Container className="py-12">
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-3 text-sm font-bold text-gray-500">
                            Admin / Events / Edit
                        </p>

                        <h1 className="text-3xl font-black text-gray-950">
                            소재 수정
                        </h1>

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                            수정 제안 내용을 확인한 뒤, 실제 공개 데이터를 직접 수정하는
                            화면입니다.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/submissions" className="btn-secondary">
                            제보 검수
                        </Link>

                        <Link href="/admin/events" className="btn-secondary">
                            목록으로
                        </Link>

                        <Link href={`/events/${event.slug}`} className="btn-primary">
                            공개 화면 보기
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 rounded-2xl bg-gray-50 p-5">
                            <p className="text-sm font-bold text-gray-500">
                                현재 항목
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-gray-950">
                                {event.title}
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-gray-600">
                                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-100">
                                    {formatMonthDay(event.month, event.day)}
                                </span>

                                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-100">
                                    {eventTypeLabelMap[event.type]}
                                </span>

                                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-100">
                                    {eventCategoryLabelMap[event.category]}
                                </span>

                                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-100">
                                    slug: {event.slug}
                                </span>
                            </div>
                        </div>

                        <form action={updateEvent} className="grid gap-5">
                            <input type="hidden" name="eventId" value={event.id} />
                            <input
                                type="hidden"
                                name="currentSlug"
                                value={event.slug}
                            />

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    제목
                                </label>

                                <input
                                    name="title"
                                    defaultValue={event.title}
                                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        월
                                    </label>

                                    <input
                                        name="month"
                                        defaultValue={event.month}
                                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        일
                                    </label>

                                    <input
                                        name="day"
                                        defaultValue={event.day}
                                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        연도 선택
                                    </label>

                                    <input
                                        name="year"
                                        defaultValue={event.year ?? ""}
                                        placeholder="비워두면 반복 날짜"
                                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        분류
                                    </label>

                                    <select
                                        name="type"
                                        defaultValue={event.type}
                                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                    >
                                        {eventTypeOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        카테고리 / 분야
                                    </label>

                                    <select
                                        name="category"
                                        defaultValue={event.category}
                                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                    >
                                        {eventCategoryOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        신뢰도
                                    </label>

                                    <select
                                        name="trustLevel"
                                        defaultValue={event.trustLevel}
                                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                    >
                                        {trustLevelOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        공개 상태
                                    </label>

                                    <select
                                        name="status"
                                        defaultValue={event.status}
                                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                    >
                                        {statusOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    설명
                                </label>

                                <textarea
                                    name="description"
                                    defaultValue={event.description}
                                    rows={8}
                                    className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none focus:border-black"
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full">
                                수정 내용 저장하기
                            </button>
                        </form>
                    </section>

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                수정 운영 방식
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-gray-500">
                                <p>
                                    수정 제안 승인은 사용자의 제안을 검토 완료 처리하는
                                    의미입니다.
                                </p>

                                <p>
                                    실제 제목, 날짜, 설명 변경은 이 화면에서 관리자가 직접
                                    수정합니다.
                                </p>

                                <p>
                                    비공개 생일, 추정 생일, 사적 정보는 등록하지 않는 것을
                                    권장합니다.
                                </p>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                                출처 목록
                            </h2>

                            <div className="mt-4 space-y-3">
                                {event.sources.length === 0 ? (
                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <p className="text-sm leading-6 text-gray-500">
                                            등록된 출처가 없습니다.
                                        </p>
                                    </div>
                                ) : (
                                    event.sources.map((source, index) => (
                                        <div
                                            key={source.id}
                                            className="rounded-2xl border border-gray-100 p-4"
                                        >
                                            <p className="text-xs font-bold text-gray-400">
                                                출처 {index + 1}
                                            </p>

                                            <p className="mt-1 font-bold text-gray-950">
                                                {source.title}
                                            </p>

                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 block break-all text-xs leading-5 text-gray-500 hover:text-black"
                                            >
                                                {source.url}
                                            </a>

                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span
                                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                                                    {source.type}
                                                </span>

                                                <form action={deleteEventSource}>
                                                    <input
                                                        type="hidden"
                                                        name="sourceId"
                                                        value={source.id}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="currentSlug"
                                                        value={event.slug}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                                                    >
                                                        삭제
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-950">
                            출처 직접 추가
                            </h2>

                            <form action={addEventSource} className="mt-4 grid gap-3">
                                <input type="hidden" name="eventId" value={event.id}/>
                                <input
                                    type="hidden"
                                    name="currentSlug"
                                    value={event.slug}
                                />

                                <input
                                    name="sourceTitle"
                                    placeholder="출처 제목"
                                    required
                                    className="h-11 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                />

                                <input
                                    name="sourceUrl"
                                    placeholder="https://"
                                    required
                                    className="h-11 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                />

                                <select
                                    name="sourceType"
                                    defaultValue="COMMUNITY"
                                    className="h-11 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                                >
                                    {sourceTypeOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                                    <input name="verified" type="checkbox"/>
                                    확인된 출처로 표시
                                </label>

                                <button type="submit" className="btn-secondary w-full">
                                    출처 추가
                                </button>
                            </form>
                        </section>
                    </aside>
                </div>
            </Container>
        </main>
    );
}