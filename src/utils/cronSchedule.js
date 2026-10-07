const monthNames = new Map(["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map((name, index) => [name, index + 1]));
const weekdayNames = new Map(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((name, index) => [name, index]));

const fieldDefinitions = [
    { label: "Minute", min: 0, max: 59 },
    { label: "Hour", min: 0, max: 23 },
    { label: "Day of month", min: 1, max: 31 },
    { label: "Month", min: 1, max: 12, names: monthNames },
    { label: "Day of week", min: 0, max: 7, names: weekdayNames, sundayAlias: true },
];

const parseValue = (value, definition) => {
    const normalized = value.toUpperCase();
    const namedValue = definition.names?.get(normalized);
    if (namedValue !== undefined) return namedValue;
    if (!/^\d+$/.test(value)) throw new Error(`${definition.label} contains an invalid value: ${value}.`);

    const number = Number(value);
    if (number < definition.min || number > definition.max) {
        throw new Error(`${definition.label} values must be from ${definition.min} to ${definition.max}${definition.sundayAlias ? " (7 also means Sunday)" : ""}.`);
    }
    return number;
};

const addFieldValue = (values, value, definition) => {
    values.add(definition.sundayAlias && value === 7 ? 0 : value);
};

export const parseCronField = (expression, definition) => {
    const value = expression.trim();
    if (!value) throw new Error(`${definition.label} cannot be empty.`);
    const values = new Set();
    const segments = value.split(",");

    for (const segment of segments) {
        if (!segment) throw new Error(`${definition.label} has an empty list item.`);
        const stepParts = segment.split("/");
        if (stepParts.length > 2 || stepParts.some((part) => !part)) {
            throw new Error(`${definition.label} has an invalid step expression.`);
        }

        const step = stepParts.length === 2 ? Number(stepParts[1]) : 1;
        if (!Number.isInteger(step) || step < 1) throw new Error(`${definition.label} steps must be positive whole numbers.`);

        const base = stepParts[0];
        let start;
        let end;

        if (base === "*") {
            start = definition.min;
            end = definition.max;
        } else if (base.includes("-")) {
            const rangeParts = base.split("-");
            if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1]) {
                throw new Error(`${definition.label} has an invalid range.`);
            }
            start = parseValue(rangeParts[0], definition);
            end = parseValue(rangeParts[1], definition);
            if (end < start) throw new Error(`${definition.label} ranges must go from the smaller value to the larger value.`);
        } else {
            start = parseValue(base, definition);
            end = stepParts.length === 2 ? definition.max : start;
        }

        for (let current = start; current <= end; current += step) addFieldValue(values, current, definition);
    }

    return { values, wildcard: value === "*" };
};

export const parseCronExpression = (expression) => {
    const tokens = expression.trim().split(/\s+/).filter(Boolean);
    if (tokens.length !== 5) throw new Error("A cron expression must contain five fields: minute, hour, day, month, and weekday.");

    const fields = tokens.map((token, index) => parseCronField(token, fieldDefinitions[index]));
    return { tokens, fields };
};

const matchesDate = (date, tokens, fields) => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;
    if (!minute.values.has(date.getMinutes()) || !hour.values.has(date.getHours()) || !month.values.has(date.getMonth() + 1)) return false;

    const matchesDayOfMonth = dayOfMonth.values.has(date.getDate());
    const matchesDayOfWeek = dayOfWeek.values.has(date.getDay());
    const dayOfMonthIsWildcard = tokens[2] === "*";
    const dayOfWeekIsWildcard = tokens[4] === "*";

    if (dayOfMonthIsWildcard && dayOfWeekIsWildcard) return true;
    if (dayOfMonthIsWildcard) return matchesDayOfWeek;
    if (dayOfWeekIsWildcard) return matchesDayOfMonth;
    return matchesDayOfMonth || matchesDayOfWeek;
};

export const getUpcomingRuns = (expression, fromDate = new Date(), limit = 5, horizonDays = 366) => {
    if (!(fromDate instanceof Date) || Number.isNaN(fromDate.getTime())) throw new Error("Choose a valid starting date.");
    if (!Number.isInteger(limit) || limit < 1 || limit > 10) throw new Error("Preview between one and ten upcoming runs.");
    if (!Number.isInteger(horizonDays) || horizonDays < 1 || horizonDays > 366) throw new Error("The preview window must be from one to 366 days.");

    const { tokens, fields } = parseCronExpression(expression);
    const candidate = new Date(fromDate);
    candidate.setSeconds(0, 0);
    candidate.setMinutes(candidate.getMinutes() + 1);
    const maxMinutes = horizonDays * 24 * 60;
    const occurrences = [];

    for (let index = 0; index < maxMinutes && occurrences.length < limit; index += 1) {
        if (matchesDate(candidate, tokens, fields)) occurrences.push(new Date(candidate));
        candidate.setMinutes(candidate.getMinutes() + 1);
    }

    return occurrences;
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatFieldValue = (rawValue, fieldIndex) => {
    const numericValue = Number(rawValue);
    if (!Number.isInteger(numericValue)) {
        if (fieldIndex === 3 && monthNames.has(rawValue.toUpperCase())) return monthLabels[monthNames.get(rawValue.toUpperCase()) - 1];
        if (fieldIndex === 4 && weekdayNames.has(rawValue.toUpperCase())) return weekdayLabels[weekdayNames.get(rawValue.toUpperCase())];
        return rawValue;
    }
    if (fieldIndex === 3) return monthLabels[numericValue - 1] ?? rawValue;
    if (fieldIndex === 4) return weekdayLabels[numericValue === 7 ? 0 : numericValue] ?? rawValue;
    return rawValue;
};

const formatList = (items) => items.length === 1 ? items[0] : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

const formatTime = (hour, minute) => `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

export const describeCronExpression = (expression) => {
    const { tokens } = parseCronExpression(expression);
    const [minute, hour, day, month, weekday] = tokens;
    const everyDay = day === "*" && month === "*" && weekday === "*";

    if (tokens.every((token) => token === "*")) return "Runs every minute.";
    if (/^\*\/\d+$/.test(minute) && hour === "*" && everyDay) return `Runs every ${minute.split("/")[1]} minutes.`;
    if (minute === "0" && hour === "*" && everyDay) return "Runs at the start of every hour.";
    if (/^\d+$/.test(minute) && /^\d+$/.test(hour)) {
        const time = formatTime(hour, minute);
        if (everyDay) return `Runs every day at ${time}.`;
        if (day === "*" && month === "*" && weekday === "1-5") return `Runs Monday through Friday at ${time}.`;
        if (day === "*" && month === "*" && /^\d$/.test(weekday)) return `Runs every ${formatFieldValue(weekday, 4)} at ${time}.`;
        if (day !== "*" && month === "*" && weekday === "*") return `Runs on day ${day} of every month at ${time}.`;
    }

    const minuteDescription = minute === "*" ? "every minute" : `minute ${minute.replaceAll(",", ", ")}`;
    const hourDescription = hour === "*" ? "every hour" : `hour ${hour.replaceAll(",", ", ")}`;
    const dayDescription = day === "*" ? "every day of the month" : `day ${day.replaceAll(",", ", ")} of the month`;
    const monthDescription = month === "*" ? "every month" : formatList(month.split(",").map((item) => formatFieldValue(item, 3)));
    const weekdayDescription = weekday === "*" ? "every weekday" : formatList(weekday.split(",").map((item) => formatFieldValue(item, 4)));
    return `Runs at ${minuteDescription} of ${hourDescription}, on ${dayDescription}, in ${monthDescription}, and on ${weekdayDescription}.`;
};

export const cronFieldDefinitions = fieldDefinitions.map(({ label, min, max }) => ({ label, min, max }));
