export function formatDate(value: string | number | null | undefined): string {
    console.log("formatDate called with:", value, "type:", typeof value);

    if (!value && value !== 0) {
        return "Дата не указана";
    }

    let date: Date;

    if (typeof value === 'number') {
        // Если это timestamp в секундах, конвертируем в миллисекунды
        const timestamp = value < 10000000000 ? value * 1000 : value;
        date = new Date(timestamp);
    } else {
        date = new Date(value);
    }

    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", value);
        return "Некорректная дата";
    }

    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

export function formatDateShort(value: string | number | null | undefined): string {
    console.log("formatDateShort called with:", value, "type:", typeof value);

    if (!value && value !== 0) {
        return "Дата не указана";
    }

    let date: Date;

    if (typeof value === 'number') {
        // Если это timestamp в секундах, конвертируем в миллисекунды
        const timestamp = value < 10000000000 ? value * 1000 : value;
        date = new Date(timestamp);
    } else {
        date = new Date(value);
    }

    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", value);
        return "Некорректная дата";
    }

    return date.toLocaleDateString("ru-RU");
}