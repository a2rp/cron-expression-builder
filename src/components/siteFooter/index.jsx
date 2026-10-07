import { LuCoffee, LuExternalLink, LuGithub, LuGlobe, LuHeart, LuLinkedin, LuMail, LuPalette, LuYoutube } from "react-icons/lu";
import styles from "./styles.module.css";

const links = [
    { label: "Portfolio", href: "https://www.ashishranjan.net", icon: LuGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", icon: LuGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: LuPalette },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: LuLinkedin },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: LuHeart },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: LuYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: LuMail },
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: LuHeart },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan", icon: LuCoffee },
    { label: "Patreon", href: "https://www.patreon.com/ashishranjan", icon: LuExternalLink },
];

const SiteFooter = () => (
    <footer className={styles.siteFooter}>
        <div className={styles.footerInner}>
            <div className={styles.copyright}>
                <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer" aria-label="Ashish Ranjan portfolio"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" /></a>
                <p>© {new Date().getFullYear()} <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
            </div>
            <div className={styles.footerLinks}>
                <a href="https://github.com/a2rp/cron-expression-builder" target="_blank" rel="noreferrer"><LuGithub aria-hidden="true" /> Source code</a>
                {links.map(({ label, href, icon: Icon }) => <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"}><Icon aria-hidden="true" /> {label}</a>)}
            </div>
        </div>
    </footer>
);

export default SiteFooter;
