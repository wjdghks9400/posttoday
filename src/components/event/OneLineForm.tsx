"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
    createOneLine,
    OneLineState,
} from "@/app/events/[slug]/one-lines/actions";

interface OneLineFormProps {
    eventId: string;
    slug: string;
}

const initialState: OneLineState = {
    ok: false,
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-2xl bg-black px-5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
        >
            {pending ? "등록 중..." : "남기기"}
        </button>
    );
}

export default function OneLineForm({ eventId, slug }: OneLineFormProps) {
    const [state, formAction] = useActionState(createOneLine, initialState);

    return (
        <form action={formAction} className="space-y-3">
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="slug" value={slug} />

            <div className="hidden" aria-hidden="true">
                <label>
                    Website
                    <input
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </label>
            </div>

            <div className="grid gap-3 md:grid-cols-[150px_1fr_auto]">
                <input
                    name="nickname"
                    maxLength={20}
                    placeholder="닉네임"
                    className="h-11 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                />

                <input
                    name="body"
                    minLength={2}
                    maxLength={100}
                    required
                    placeholder=" "
                    className="h-11 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
                />

                <SubmitButton />
            </div>

            {state.message && (
                <p
                    className={`text-sm font-semibold ${
                        state.ok ? "text-green-700" : "text-red-600"
                    }`}
                >
                    {state.message}
                </p>
            )}
        </form>
    );
}
