"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
    createNewEventSubmission,
    SubmitState,
} from "@/app/submit/actions";
import { eventCategoryOptions, eventTypeOptions } from "@/lib/event-options";

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
            {pending ? "신규 제보 접수 중..." : "신규 항목 제보하기"}
        </button>
    );
}

export default function SubmissionForm() {
    const [state, formAction] = useActionState(
        createNewEventSubmission,
        initialState
    );

    if (state.ok) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-2xl text-white">
                    ✓
                </div>

                <h2 className="text-2xl font-black text-gray-950">
                    신규 항목 제보가 접수되었습니다
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    {state.message}
                </p>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <a href="/submit" className="btn-primary">
                        다른 항목 제보하기
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
            <div className="grid gap-5">
                {state.message && !state.ok && (
                    <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                        {state.message}
                    </div>
                )}

                <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-sm font-bold text-gray-950">
                        신규 항목만 제보하는 화면입니다
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        이미 등록된 항목의 수정 제안이나 출처 추가는 각 항목 상세
                        페이지에서 진행해주세요.
                    </p>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        항목 제목
                    </label>

                    <input
                        name="title"
                        placeholder="예: 페이커 생일, 세계 웃음의 날, 어떤 밈 시작일"
                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            분류
                        </label>

                        <select
                            name="eventType"
                            className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                        >
                            {eventTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <p className="mt-2 text-xs leading-5 text-gray-400">
                            이 항목이 생일인지, 사건인지, 밈인지 선택해주세요.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            카테고리 / 분야
                        </label>

                        <select
                            name="category"
                            className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                        >
                            {eventCategoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <p className="mt-2 text-xs leading-5 text-gray-400">
                            연예인, 인플루언서, e스포츠, 게임, 애니, 밈 등 어느
                            분야인지 선택해주세요.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            월
                        </label>

                        <input
                            name="month"
                            placeholder="5"
                            className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            일
                        </label>

                        <input
                            name="day"
                            placeholder="7"
                            className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        출처 URL
                    </label>

                    <input
                        name="sourceUrl"
                        placeholder="https://"
                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                        공식 프로필, 공식 홈페이지, 기사, 위키 등 공개적으로 확인
                        가능한 링크를 넣어주세요.
                    </p>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        설명
                    </label>

                    <textarea
                        name="description"
                        placeholder="이 날짜가 왜 의미 있는지, 어떤 출처를 기준으로 하는지 적어주세요."
                        rows={6}
                        className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none focus:border-black"
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