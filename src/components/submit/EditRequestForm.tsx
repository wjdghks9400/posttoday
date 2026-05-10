"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
    createEditRequestSubmission,
    SubmitState,
} from "@/app/submit/actions";
import {
    calendarEventCategoryLabelMap,
    eventTypeLabelMap,
} from "@/lib/event-options";
import { formatMonthDay } from "@/lib/date";
import { CalendarEvent } from "@/types/event";

const initialState: SubmitState = {
    ok: false,
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full disabled:bg-gray-400"
        >
            {pending ? "수정 제안 접수 중..." : "수정 제안 보내기"}
        </button>
    );
}

export default function EditRequestForm({ event }: { event: CalendarEvent }) {
    const [state, formAction] = useActionState(
        createEditRequestSubmission,
        initialState
    );

    if (state.ok) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-2xl text-white">
                    ✓
                </div>

                <h2 className="text-2xl font-black text-gray-950">
                    수정 제안이 접수되었습니다
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    {state.message}
                </p>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <a href={`/events/${event.slug}`} className="btn-primary">
                        항목으로 돌아가기
                    </a>

                    <a href="/" className="btn-secondary">
                        홈으로 돌아가기
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form
            action={formAction}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
            <input type="hidden" name="title" value={event.title} />
            <input type="hidden" name="month" value={event.month} />
            <input type="hidden" name="day" value={event.day} />
            <input type="hidden" name="eventType" value={event.type} />
            <input type="hidden" name="category" value={event.category} />

            <div className="grid gap-5">
                {state.message && !state.ok && (
                    <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                        {state.message}
                    </div>
                )}

                <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-sm font-bold text-gray-950">
                        수정 제안 대상
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-gray-950">
                        {event.title}
                    </h2>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                        <div className="rounded-2xl bg-white p-4">
                            <p className="text-gray-400">날짜</p>
                            <p className="mt-1 font-bold text-gray-950">
                                {formatMonthDay(event.month, event.day)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <p className="text-gray-400">분류</p>
                            <p className="mt-1 font-bold text-gray-950">
                                {eventTypeLabelMap[event.type]}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <p className="text-gray-400">분야</p>
                            <p className="mt-1 font-bold text-gray-950">
                                {calendarEventCategoryLabelMap[event.category]}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                            <p className="text-gray-400">현재 출처 수</p>
                            <p className="mt-1 font-bold text-gray-950">
                                {event.sources.length}개
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
                    <p className="text-sm font-bold text-yellow-800">
                        수정 제안은 자동 반영되지 않습니다
                    </p>

                    <p className="mt-2 text-sm leading-6 text-yellow-700">
                        관리자가 제안을 확인한 뒤 승인 처리할 수 있지만, 실제 제목·날짜·설명·분류
                        변경은 관리자 소재 관리 화면에서 직접 수정합니다.
                    </p>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        어떤 정보가 잘못되었나요?
                    </label>
                    <textarea
                        name="description"
                        placeholder="예: 설명의 일부가 잘못되었습니다. 공식 프로필 기준으로는 ..."
                        rows={7}
                        className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        근거 출처 URL 선택
                    </label>
                    <input
                        name="sourceUrl"
                        placeholder="https://"
                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        제보자 이메일 선택
                    </label>
                    <input
                        name="submitterEmail"
                        placeholder="답변 받을 이메일이 있다면 입력"
                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                    />
                </div>

                <SubmitButton />
            </div>
        </form>
    );
}