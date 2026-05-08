export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED" | "NEED_MORE";

export interface MockSubmission {
    id: string;
    title: string;
    category: string;
    date: string;
    sourceUrl: string;
    type: "신규 제보" | "수정 제안" | "출처 추가" | "신고";
    status: SubmissionStatus;
    createdAt: string;
}

export const mockSubmissions: MockSubmission[] = [
    {
        id: "sub-1",
        title: "가상 스트리머 C 생일",
        category: "인플루언서",
        date: "6월 3일",
        sourceUrl: "https://example.com",
        type: "신규 제보",
        status: "PENDING",
        createdAt: "2026-05-07",
    },
    {
        id: "sub-2",
        title: "인터넷 밈 다시 꺼내기 좋은 날",
        category: "밈",
        date: "5월 7일",
        sourceUrl: "https://example.com",
        type: "출처 추가",
        status: "NEED_MORE",
        createdAt: "2026-05-06",
    },
    {
        id: "sub-3",
        title: "브랜드 감사 이벤트 데이",
        category: "브랜드",
        date: "5월 7일",
        sourceUrl: "https://example.com",
        type: "수정 제안",
        status: "APPROVED",
        createdAt: "2026-05-05",
    },
];