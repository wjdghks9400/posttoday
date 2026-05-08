"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createSubmission, SubmitState } from "@/app/submit/actions";

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
            className="h-12 rounded-2xl bg-black text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
            {pending ? "제보 접수 중..." : "제보 제출하기"}
        </button>
    );
}

export default function SubmissionForm() {
    const [state, formAction] = useActionState(createSubmission, initialState);

    if (state.ok) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-2xl text-white">
                    ✓
                </div>

                <h2 className="text-2xl font-black text-gray-950">
                    제보가 접수되었습니다
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">{state.message}</p>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                        href="/submit"
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-5 text-sm font-bold text-white"
                    >
                        다른 소재 제보하기
                    </a>

                    <a
                        href="/admin/submissions"
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-gray-100 px-5 text-sm font-bold text-gray-700"
                    >
                        관리자 제보 목록 보기
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

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        제보 유형
                    </label>
                    <select
                        name="type"
                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                    >
                        <option>신규 제보</option>
                        <option>수정 제안</option>
                        <option>출처 추가</option>
                        <option>오류/개인정보 신고</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        소재 제목
                    </label>
                    <input
                        name="title"
                        placeholder="예: ○○ 생일, ○○ 기념일"
                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                    />
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
                        카테고리
                    </label>
                    <select
                        name="category"
                        className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                    >
                        <option>생일</option>
                        <option>기념일</option>
                        <option>밈</option>
                        <option>팬덤 이벤트</option>
                        <option>브랜드</option>
                        <option>역사</option>
                        <option>인플루언서</option>
                    </select>
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