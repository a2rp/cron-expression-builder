import { useState } from "react";
import { LuCalendarDays, LuCheck, LuCode } from "react-icons/lu";
import BackToTop from "./components/backToTop/index.jsx";
import ExpressionBuilder from "./components/expressionBuilder/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import UpcomingRuns from "./components/upcomingRuns/index.jsx";
import styles from "./App.module.css";

const initialExpression = "0 9 * * 1-5";
const fieldNames = ["minute", "hour", "day", "month", "weekday"];

const App = () => {
    const [expression, setExpression] = useState(initialExpression);
    const fields = expression.trim().split(/\s+/).filter(Boolean);

    const selectPreset = (preset) => {
        if (preset !== "custom") setExpression(preset);
    };

    return (
        <div className={styles.appShell} id="top">
            <SiteHeader />
            <main className={styles.mainContent}>
                <section className={styles.intro} aria-labelledby="page-title">
                    <div className={styles.introCopy}>
                        <span className={styles.introLabel}>
                            <LuCode aria-hidden="true" /> SCHEDULE WORKBENCH
                        </span>
                        <h1 id="page-title">
                            Make time
                            <br />
                            work for you.
                        </h1>
                        <p>
                            Shape a cron schedule, see what it means, and check
                            when it will run next. Five small fields make a
                            dependable routine.
                        </p>
                        <div className={styles.introFacts}>
                            <span>
                                <LuCheck aria-hidden="true" /> Five-field syntax
                            </span>
                            <span>
                                <LuCheck aria-hidden="true" /> Local time
                                preview
                            </span>
                            <span>
                                <LuCheck aria-hidden="true" /> Runs in your
                                browser
                            </span>
                        </div>
                    </div>
                    <div className={styles.fieldGuide}>
                        <div className={styles.guideHeader}>
                            <LuCalendarDays aria-hidden="true" />
                            <span>THE SCHEDULE FORMAT</span>
                        </div>
                        <div
                            className={styles.guideExpression}
                            aria-label={`Current expression: ${expression}`}
                        >
                            {fieldNames.map((field, index) => (
                                <div className={styles.guideField} key={field}>
                                    <code>{fields[index] ?? "*"}</code>
                                    <span>{field}</span>
                                </div>
                            ))}
                        </div>
                        <p>
                            Move left to right: from small time units to
                            calendar days.
                        </p>
                    </div>
                    <div className={styles.introStamp} aria-hidden="true">
                        CRON
                        <br />
                        MADE
                        <br />
                        CLEAR
                    </div>
                </section>
                <div className={styles.workspace}>
                    <ExpressionBuilder
                        expression={expression}
                        onExpressionChange={setExpression}
                        onPresetSelect={selectPreset}
                    />
                    <aside
                        className={styles.previewColumn}
                        aria-label="Schedule preview"
                    >
                        <UpcomingRuns expression={expression} />
                        <div className={styles.previewTip}>
                            <strong>Reading the fields</strong>
                            <p>
                                Wildcards match all values. Commas add choices,
                                hyphens set a range, and a slash sets an
                                interval.
                            </p>
                        </div>
                    </aside>
                </div>
                <p className={styles.privacyNote}>
                    No account or server required. Your expression stays in this
                    browser tab.
                </p>
            </main>
            <SiteFooter />
            <BackToTop />
        </div>
    );
};

export default App;
