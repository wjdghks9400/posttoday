interface AdPlaceholderProps {
    label?: string;
    size?: "banner" | "rectangle" | "wide";
}

export default function AdPlaceholder({
                                          label = "광고 영역",
                                          size = "banner",
                                      }: AdPlaceholderProps) {
    const sizeClassMap = {
        banner: "min-h-24",
        rectangle: "min-h-64",
        wide: "min-h-32",
    };

    return (
        <div
            className={`flex items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white text-sm text-gray-400 ${sizeClassMap[size]}`}
        >
            {label}
        </div>
    );
}