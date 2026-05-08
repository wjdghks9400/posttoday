export function formatMonthDay(month: number, day: number) {
    return `${month}월 ${day}일`;
}

export function getTodayLabel() {
    const today = new Date();
    return `${today.getMonth() + 1}월 ${today.getDate()}일`;
}