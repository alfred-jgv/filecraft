import { useNavigate } from "react-router-dom";
import { ArrowRight, FileJson, Merge, Split, RefreshCw } from "lucide-react";
import styles from "./Dashboard.module.css";

const TOOLS = [
    {
        label: "PDF → Word",
        description: "Convert any PDF into an editable Word document",
        to: "/tools/pdf-to-word",
        accent: "#0f6e56",
        bg: "#e8f4ee",
        icon: FileJson,
    },
    {
        label: "Merge PDFs",
        description: "Combine multiple PDF files into one",
        to: "/tools/merge",
        accent: "#854F0B",
        bg: "#faeeda",
        icon: Merge,
    },
    {
        label: "Split PDF",
        description: "Extract pages or split a PDF into separate files",
        to: "/tools/split",
        accent: "#633806",
        bg: "#fff3e0",
        icon: Split,
    },
    {
        label: "Convert",
        description: "Transform between PDF, DOCX, PNG, JPG and more",
        to: "/tools/convert",
        accent: "#2c2c2a",
        bg: "#f0ece0",
        icon: RefreshCw,
    },
];

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Your tools</h1>
                <p className={styles.subtitle}>Pick a tool to get started</p>
            </div>

            <div className={styles.grid}>
                {TOOLS.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                        <button
                            key={tool.to}
                            className={styles.card}
                            onClick={() => navigate(tool.to)}
                            style={{ "--accent": tool.accent, "--bg": tool.bg } as React.CSSProperties}
                        >
                            <div className={styles.iconWrapper}>
                                <IconComponent size={24} strokeWidth={1.5} />
                            </div>
                            <div className={styles.cardBody}>
                                <h2 className={styles.cardTitle}>{tool.label}</h2>
                                <p className={styles.cardDesc}>{tool.description}</p>
                            </div>
                            <ArrowRight size={20} className={styles.arrow} strokeWidth={1.5} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}