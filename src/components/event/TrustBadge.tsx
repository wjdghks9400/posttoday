import { TrustLevel } from "@/types/event";

interface TrustBadgeProps {
    trustLevel: TrustLevel;
}

const trustMap: Record<
    TrustLevel,
    {
        label: string;
        className: string;
    }
> = {
    OFFICIAL: {
        label: "공식 확인",
        className: "bg-green-50 text-green-700 ring-green-600/20",
    },
    SOURCE_VERIFIED: {
        label: "출처 확인",
        className: "bg-blue-50 text-blue-700 ring-blue-600/20",
    },
    COMMUNITY: {
        label: "커뮤니티 기반",
        className: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    },
    UNCERTAIN: {
        label: "불확실",
        className: "bg-gray-50 text-gray-600 ring-gray-500/20",
    },
};

export default function TrustBadge({ trustLevel }: TrustBadgeProps) {
    const trust = trustMap[trustLevel];

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${trust.className}`}
        >
      {trust.label}
    </span>
    );
}