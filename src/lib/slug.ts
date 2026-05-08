export function createSlug(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w가-힣\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function createSlugWithDate(title: string, month?: number | null, day?: number | null) {
    const baseSlug = createSlug(title);

    if (month && day) {
        return `${baseSlug}-${month}-${day}`;
    }

    return baseSlug;
}