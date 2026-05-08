interface SectionTitleProps {
    title: string;
    description?: string;
    eyebrow?: string;
}

export default function SectionTitle({
                                         title,
                                         description,
                                         eyebrow,
                                     }: SectionTitleProps) {
    return (
        <div className="mb-6">
            {eyebrow ? (
                <p className="mb-2 text-sm font-semibold text-gray-500">{eyebrow}</p>
            ) : null}

            <h2 className="text-3xl font-black tracking-tight text-gray-950">
                {title}
            </h2>

            {description ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                    {description}
                </p>
            ) : null}
        </div>
    );
}