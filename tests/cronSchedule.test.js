import assert from "node:assert/strict";
import test from "node:test";
import {
    describeCronExpression,
    getUpcomingRuns,
    parseCronExpression,
} from "../src/utils/cronSchedule.js";

test("parses five fields with named months, weekdays, lists, ranges, and steps", () => {
    const { fields } = parseCronExpression("*/15 9-17 1,15 JAN,MAR MON-FRI");
    assert.equal(fields[0].values.size, 4);
    assert.equal(fields[1].values.size, 9);
    assert.deepEqual([...fields[2].values], [1, 15]);
    assert.deepEqual([...fields[3].values], [1, 3]);
    assert.deepEqual([...fields[4].values], [1, 2, 3, 4, 5]);
});

test("returns upcoming minute-based runs after the selected instant", () => {
    const start = new Date(2024, 0, 1, 10, 7, 42);
    const runs = getUpcomingRuns("*/15 * * * *", start, 3);
    assert.deepEqual(
        runs.map((date) => `${date.getHours()}:${date.getMinutes()}`),
        ["10:15", "10:30", "10:45"],
    );
    assert.equal(runs[0].getSeconds(), 0);
});

test("treats restricted day-of-month and weekday fields as an either-or match", () => {
    const start = new Date(2024, 1, 26, 9, 1);
    const runs = getUpcomingRuns("0 9 1 * MON", start, 2);
    assert.deepEqual(
        runs.map((date) => [date.getMonth() + 1, date.getDate()]),
        [
            [3, 1],
            [3, 4],
        ],
    );
});

test("accepts seven as Sunday and returns the following Sunday", () => {
    const runs = getUpcomingRuns("0 9 * * 7", new Date(2024, 0, 6, 9, 0), 1);
    assert.deepEqual([runs[0].getDay(), runs[0].getHours()], [0, 9]);
});

test("describes common schedule presets in plain language", () => {
    assert.equal(
        describeCronExpression("*/15 * * * *"),
        "Runs every 15 minutes.",
    );
    assert.equal(
        describeCronExpression("0 9 * * 1-5"),
        "Runs Monday through Friday at 09:00.",
    );
    assert.equal(
        describeCronExpression("0 0 * * *"),
        "Runs every day at 00:00.",
    );
    assert.equal(
        describeCronExpression("5 8 1,15 JAN-MAR MON-FRI"),
        "Runs at minute 5 during hour 8 on day 1st and 15th or weekdays Monday through Friday in January through March.",
    );
});

test("rejects invalid field counts, ranges, and zero steps", () => {
    assert.throws(() => parseCronExpression("* * * *"), /five fields/);
    assert.throws(() => parseCronExpression("60 * * * *"), /Minute values/);
    assert.throws(
        () => parseCronExpression("*/0 * * * *"),
        /steps must be positive/,
    );
    assert.throws(() => parseCronExpression("* * * * FUNDAY"), /invalid value/);
    assert.throws(() => parseCronExpression("* * * * 5-1"), /smaller value/);
});
