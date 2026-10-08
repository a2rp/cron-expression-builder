import { LuArrowDownRight, LuClock, LuGithub } from "react-icons/lu";
import styles from "./styles.module.css";

const SiteHeader = () => (
    <header className={styles.siteHeader}>
        <a className={styles.brand} href="#top" aria-label="Cron Builder home">
            <span>
                <LuClock aria-hidden="true" />
            </span>{" "}
            cron builder
        </a>
        <nav aria-label="Main navigation">
            <a href="#builder">
                Expression <LuArrowDownRight aria-hidden="true" />
            </a>
            <a href="#upcoming">
                Upcoming runs <LuArrowDownRight aria-hidden="true" />
            </a>
        </nav>
        <a
            className={styles.repository}
            href="https://github.com/a2rp/cron-expression-builder"
            target="_blank"
            rel="noreferrer"
        >
            <LuGithub aria-hidden="true" />
            <span>Repository</span>
        </a>
    </header>
);

export default SiteHeader;
