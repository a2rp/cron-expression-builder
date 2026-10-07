import { useMemo } from "react";
import { LuCalendarDays, LuClock, LuGlobe } from "react-icons/lu";
import { getUpcomingRuns, parseCronExpression } from "../../utils/cronSchedule.js";
import styles from "./styles.module.css";

const dateFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "local time";

const UpcomingRuns = ({ expression }) => {
    const schedule = useMemo(() => {
        try {
            parseCronExpression(expression);
            return { runs: getUpcomingRuns(expression, new Date(), 5), error: "" };
        } catch (error) {
            return { runs: [], error: error.message };
        }
    }, [expression]);

    return (
        <section className={styles.upcomingRuns} id="upcoming" aria-labelledby="upcoming-title" aria-live="polite">
            <div className={styles.previewHeader}>
                <div className={styles.headingLine}>
                    <span className={styles.headingIcon}><LuCalendarDays aria-hidden="true" /></span>
                    <div><h2 id="upcoming-title">Upcoming runs</h2><p>The next five matching times for this schedule.</p></div>
                </div>
                <span className={styles.zoneLabel}><LuGlobe aria-hidden="true" /> Local time</span>
            </div>
            <div className={styles.timeZone}><LuClock aria-hidden="true" /><span>{localTimeZone}</span></div>

            {schedule.error ? (
                <div className={styles.emptyState}>
                    <span><LuCalendarDays aria-hidden="true" /></span>
                    <h3>Waiting for a valid schedule</h3>
                    <p>Fix the expression above to see its next run times.</p>
                </div>
            ) : schedule.runs.length ? (
                <ol className={styles.runList}>
                    {schedule.runs.map((run, index) => (
                        <li key={run.toISOString()}>
                            <span className={`${styles.runNumber} ${index === 0 ? styles.firstRun : ""}`}>{String(index + 1).padStart(2, "0")}</span>
                            <span className={styles.runDate}>{dateFormatter.format(run)}</span>
                            <time className={styles.runTime} dateTime={run.toISOString()}>{timeFormatter.format(run)}</time>
                        </li>
                    ))}
                </ol>
            ) : (
                <div className={styles.emptyState}>
                    <span><LuCalendarDays aria-hidden="true" /></span>
                    <h3>No runs in the next year</h3>
                    <p>This schedule does not match a date in the 366-day preview window.</p>
                </div>
            )}

            <p className={styles.previewNote}>Times use your device timezone. The preview searches up to 366 days ahead.</p>
        </section>
    );
};

export default UpcomingRuns;
