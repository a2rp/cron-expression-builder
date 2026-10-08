import { useState } from "react";
import { LuCheck, LuChevronDown, LuClock, LuCopy, LuZap } from "react-icons/lu";
import {
    cronFieldDefinitions,
    describeCronExpression,
    parseCronExpression,
} from "../../utils/cronSchedule.js";
import styles from "./styles.module.css";

const presets = [
    {
        expression: "* * * * *",
        label: "Every minute",
        detail: "Keep a task running often.",
    },
    {
        expression: "*/15 * * * *",
        label: "Every 15 minutes",
        detail: "Check in four times an hour.",
    },
    {
        expression: "0 * * * *",
        label: "Every hour",
        detail: "Run on the hour.",
    },
    {
        expression: "0 9 * * *",
        label: "Every day at 9 AM",
        detail: "Run each morning.",
    },
    {
        expression: "0 9 * * 1-5",
        label: "Weekdays at 9 AM",
        detail: "Skip Saturday and Sunday.",
    },
    {
        expression: "0 9 * * 1",
        label: "Every Monday at 9 AM",
        detail: "Run once at the start of the week.",
    },
    {
        expression: "0 9 1 * *",
        label: "First day of the month",
        detail: "Run monthly at 9 AM.",
    },
];

const fieldHints = [
    "0-59, */5, 10,20",
    "0-23, */2, 9",
    "1-31, 1,15",
    "1-12, JAN, MAR",
    "0-6, MON-FRI",
];

const getExpressionState = (expression) => {
    try {
        parseCronExpression(expression);
        return { error: "", description: describeCronExpression(expression) };
    } catch (error) {
        return { error: error.message, description: "" };
    }
};

const ExpressionBuilder = ({
    expression,
    onExpressionChange,
    onPresetSelect,
}) => {
    const [copyStatus, setCopyStatus] = useState("");
    const tokens = expression.trim().split(/\s+/).filter(Boolean);
    const fields = cronFieldDefinitions.map((_, index) => tokens[index] ?? "*");
    const expressionState = getExpressionState(expression);
    const selectedPreset =
        presets.find((preset) => preset.expression === expression)
            ?.expression ?? "custom";

    const changeField = (index, value) => {
        const nextFields = [...fields];
        nextFields[index] = value;
        onExpressionChange(nextFields.join(" "));
    };

    const copyExpression = async () => {
        try {
            await navigator.clipboard.writeText(expression);
            setCopyStatus("Expression copied");
        } catch {
            setCopyStatus("Clipboard unavailable");
        }
        window.setTimeout(() => setCopyStatus(""), 1800);
    };

    return (
        <section
            className={styles.expressionBuilder}
            id="builder"
            aria-labelledby="builder-title"
        >
            <div className={styles.sectionHeading}>
                <div className={styles.headingIcon}>
                    <LuClock aria-hidden="true" />
                </div>
                <div>
                    <h2 id="builder-title">Build a schedule</h2>
                    <p>Set each part of the minute, hour, and calendar.</p>
                </div>
            </div>

            <label className={styles.presetLabel} htmlFor="cron-preset">
                <span>Start from a schedule</span>
                <span className={styles.selectWrap}>
                    <select
                        id="cron-preset"
                        value={selectedPreset}
                        onChange={(event) => onPresetSelect(event.target.value)}
                    >
                        <option value="custom" disabled>
                            Custom expression
                        </option>
                        {presets.map((preset) => (
                            <option
                                value={preset.expression}
                                key={preset.expression}
                            >
                                {preset.label}
                            </option>
                        ))}
                    </select>
                    <LuChevronDown aria-hidden="true" />
                </span>
            </label>

            <label className={styles.expressionLabel} htmlFor="cron-expression">
                Cron expression
            </label>
            <div
                className={`${styles.expressionInput} ${expressionState.error ? styles.invalid : styles.valid}`}
            >
                <span aria-hidden="true">$</span>
                <input
                    id="cron-expression"
                    type="text"
                    value={expression}
                    onChange={(event) => onExpressionChange(event.target.value)}
                    spellCheck="false"
                    autoComplete="off"
                    autoCapitalize="off"
                    aria-invalid={Boolean(expressionState.error)}
                    aria-describedby="cron-validation cron-field-order"
                />
                <button
                    type="button"
                    onClick={copyExpression}
                    aria-label="Copy cron expression"
                    disabled={Boolean(expressionState.error)}
                >
                    {copyStatus === "Expression copied" ? (
                        <LuCheck aria-hidden="true" />
                    ) : (
                        <LuCopy aria-hidden="true" />
                    )}
                </button>
            </div>
            <div
                className={styles.validation}
                id="cron-validation"
                aria-live="polite"
                data-valid={!expressionState.error}
            >
                {expressionState.error ? (
                    <>
                        <span aria-hidden="true">!</span>
                        {expressionState.error}
                    </>
                ) : (
                    <>
                        <LuCheck aria-hidden="true" /> Valid five-field
                        expression
                    </>
                )}
            </div>

            <div
                className={styles.fieldOrder}
                id="cron-field-order"
                aria-label="Cron field order"
            >
                {cronFieldDefinitions.map(({ label }, index) => (
                    <span
                        key={label}
                        style={{
                            "--field-color": [
                                "#d86d43",
                                "#377d75",
                                "#9a7345",
                                "#758342",
                                "#6673a4",
                            ][index],
                        }}
                    >
                        <small>{index + 1}</small>
                        {label}
                    </span>
                ))}
            </div>

            <div className={styles.fieldGrid}>
                {cronFieldDefinitions.map(({ label, min, max }, index) => (
                    <label className={styles.fieldControl} key={label}>
                        <span>{label}</span>
                        <input
                            type="text"
                            value={fields[index]}
                            onChange={(event) =>
                                changeField(index, event.target.value)
                            }
                            aria-label={`${label} cron field`}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        <small>{fieldHints[index]}</small>
                        <span className={styles.fieldRange}>
                            {index === 4 ? "0-6, Sunday" : `${min}-${max}`}
                        </span>
                    </label>
                ))}
            </div>

            <div
                className={`${styles.description} ${expressionState.error ? styles.descriptionMuted : ""}`}
            >
                <span>
                    <LuZap aria-hidden="true" /> In plain language
                </span>
                <p>
                    {expressionState.error
                        ? "A schedule explanation will appear when all five fields are valid."
                        : expressionState.description}
                </p>
            </div>

            <div className={styles.quickSchedules}>
                <div className={styles.quickHeading}>
                    <h3>Quick schedules</h3>
                    <p>Choose a common starting point.</p>
                </div>
                <div className={styles.presetGrid}>
                    {presets.map((preset) => (
                        <button
                            className={
                                expression === preset.expression
                                    ? styles.presetSelected
                                    : ""
                            }
                            type="button"
                            key={preset.expression}
                            onClick={() => onPresetSelect(preset.expression)}
                            aria-pressed={expression === preset.expression}
                        >
                            <span>{preset.label}</span>
                            <small>{preset.detail}</small>
                        </button>
                    ))}
                </div>
            </div>
            <p className={styles.copyStatus} aria-live="polite">
                {copyStatus}
            </p>
        </section>
    );
};

export default ExpressionBuilder;
