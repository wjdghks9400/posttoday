import Link from "next/link";

interface AdPlaceholderProps {
    label?: string;
    size?: "banner" | "rectangle" | "wide";
}

export default function AdPlaceholder({
                                          label = "스폰서 영역",
                                          size = "banner",
                                      }: AdPlaceholderProps) {
    const sizeClassMap = {
        banner: "min-h-24",
        rectangle: "min-h-64",
        wide: "min-h-32",
    };

    return (
        <div
            className={`rounded-3xl border border-gray-100 bg-white p-5 shadow-sm ${sizeClassMap[size]}`}
        >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Sponsored
            </p>

            <h3 className="mt-3 text-lg font-black leading-7 text-gray-950">
                {label}
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-500">
                이 항목과 어울리는 팬덤 이벤트, 굿즈, 생일카페, 게임·애니 행사,
                콘텐츠 제작 도구 광고를 검토합니다.
            </p>

            <p className="mt-3 text-xs leading-5 text-gray-400">
                실제 광고는 운영자가 검토 후 수동으로 진행합니다.
            </p>

            <Link href="/advertise" className="btn-primary mt-5 w-full">
                광고/제휴 문의
            </Link>
        </div>
    );
}