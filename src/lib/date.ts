export function formatMonthDay(month: number, day: number) {
    return `${month}월 ${day}일`;
}

export function getTodayLabel() {
    const today = new Date();
    return `${today.getMonth() + 1}월 ${today.getDate()}일`;
}

export function isValidMonthDay(month: number, day: number) {
    const daysInMonth = [
        31,
        29,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];

    if (!Number.isInteger(month) || !Number.isInteger(day)) {
        return false;
    }

    if (month < 1 || month > 12) {
        return false;
    }

    return day >= 1 && day <= daysInMonth[month - 1];
}