import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Merge, Split, RefreshCw } from "lucide-react";
import styles from "./AppLayout.module.css";

const NAV_ITEMS = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "PDF → Word", to: "/tools/pdf-to-word", icon: FileText },
    { label: "Merge", to: "/tools/merge", icon: Merge },
    { label: "Split", to: "/tools/split", icon: Split },
    { label: "Convert", to: "/tools/convert", icon: RefreshCw },
];

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className={styles.shell}>
            <nav className={styles.nav}>
                <span className={styles.brand}>
                    <span className={styles.brandFile}>File</span>
                    <span className={styles.brandCraft}>Craft</span>
                </span>
                <div className={styles.links}>
                    {NAV_ITEMS.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `${styles.link} ${isActive ? styles.active : ""}`
                                }
                            >
                                <IconComponent size={18} strokeWidth={1.5} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
            <main className={styles.main}>{children}</main>
        </div>
    );
}