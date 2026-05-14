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
       {/*     <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Sponsored
            </p>

            <h3 className="mt-3 text-lg font-black leading-7 text-gray-950">
                {label}
            </h3>

            <Link href="/advertise" className="btn-primary mt-5 w-full">
                광고/제휴 문의
            </Link>*/}
        </div>
    );
}