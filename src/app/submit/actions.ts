"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SubmissionType } from "@prisma/client";

export interface SubmitState {
    ok: boolean;
    message: string;
}

const submissionTypeMap: Record<string, SubmissionType> = {
    "신규 제보": "NEW_EVENT",
    "수정 제안": "EDIT_REQUEST",
    "출처 추가": "SOURCE_ADD",
    "오류/개인정보 신고": "REPORT",
    신고: "REPORT",
};

function toNumberOrNull(value: FormDataEntryValue | null) {
    if (!value) return null;

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
        return null;
    }

    return numberValue;
}

export async function createSubmission(
    _prevState: SubmitState,
    formData: FormData
): Promise<SubmitState> {
    try {
        const typeText = String(formData.get("type") ?? "신규 제보");
        const title = String(formData.get("title") ?? "").trim();
        const month = toNumberOrNull(formData.get("month"));
        const day = toNumberOrNull(formData.get("day"));
        const category = String(formData.get("category") ?? "").trim();
        const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();

        console.log("submit form values:", {
            typeText,
            title,
            month,
            day,
            category,
            sourceUrl,
            description,
            submitterEmail,
        });

        if (!title) {
            return {
                ok: false,
                message: "소재 제목을 입력해주세요.",
            };
        }

        if (!description) {
            return {
                ok: false,
                message: "설명을 입력해주세요.",
            };
        }

        if (month !== null && (month < 1 || month > 12)) {
            return {
                ok: false,
                message: "월은 1부터 12 사이로 입력해주세요.",
            };
        }

        if (day !== null && (day < 1 || day > 31)) {
            return {
                ok: false,
                message: "일은 1부터 31 사이로 입력해주세요.",
            };
        }

        const type = submissionTypeMap[typeText] ?? "NEW_EVENT";

        const createdSubmission = await prisma.submission.create({
            data: {
                type,
                title,
                month,
                day,
                category: category || null,
                sourceUrl: sourceUrl || null,
                description,
                submitterEmail: submitterEmail || null,
            },
        });

        console.log("created submission:", createdSubmission);

        revalidatePath("/admin");
        revalidatePath("/admin/submissions");

        return {
            ok: true,
            message: "제보가 접수되었습니다. 관리자 검수 후 공개 여부가 결정됩니다.",
        };
    } catch (error) {
        console.error("createSubmission error:", error);

        return {
            ok: false,
            message:
                "제보 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        };
    }
}