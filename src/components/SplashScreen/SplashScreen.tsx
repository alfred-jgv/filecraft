import { useEffect, useRef, useState } from "react";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
    onComplete: () => void;
    minDuration?: number;
}

export default function SplashScreen({
    onComplete,
    minDuration = 3200,
}: SplashScreenProps) {
    const [leaving, setLeaving] = useState(false);
    const splashRef = useRef<HTMLDivElement>(null);
    const l1Ref = useRef<HTMLDivElement>(null);
    const l2Ref = useRef<HTMLDivElement>(null);
    const l3Ref = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const mouse = useRef({ x: 0, y: 0 });
    const cur = useRef({ x: 0, y: 0 });

    /* ── Parallax mouse tracking ── */
    useEffect(() => {
        const el = splashRef.current;
        if (!el) return;

        const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            mouse.current.x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
            mouse.current.y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        };
        const onLeave = () => {
            mouse.current = { x: 0, y: 0 };
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const tick = () => {
            cur.current.x = lerp(cur.current.x, mouse.current.x, 0.06);
            cur.current.y = lerp(cur.current.y, mouse.current.y, 0.06);
            const { x, y } = cur.current;

            if (l1Ref.current) l1Ref.current.style.transform = `translate(${x * -28}px, ${y * -22}px)`;
            if (l2Ref.current) l2Ref.current.style.transform = `translate(${x * -16}px, ${y * -12}px)`;
            if (l3Ref.current) l3Ref.current.style.transform = `translate(${x * -8}px, ${y * -6}px)`;

            rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    /* ── Exit after minDuration ── */
    useEffect(() => {
        const t = setTimeout(() => {
            setLeaving(true);
            setTimeout(onComplete, 600);
        }, minDuration);
        return () => clearTimeout(t);
    }, [onComplete, minDuration]);

    return (
        <div
            ref={splashRef}
            className={`${styles.splash} ${leaving ? styles.leaving : ""}`}
        >
            {/* Paper background */}
            <div className={styles.paperLines} />
            <div className={styles.marginLine} />
            {[120, 340, 560, 780].map((top) => (
                <div key={top} className={styles.hole} style={{ top }} />
            ))}
            <div className={styles.dogEar} />

            {/* ── Layer 1 — farthest, slowest ── */}
            <div ref={l1Ref} className={styles.layer}>
                <svg style={{ position: "absolute", left: 60, top: 120, width: 110, opacity: 0.10 }} viewBox="0 0 70 70">
                    <path d="M10 60 Q20 10 35 12 Q52 14 55 38 Q58 62 35 58 Q12 54 10 60Z" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                    <line x1="24" y1="28" x2="44" y2="28" stroke="#555" strokeWidth="1.5" />
                    <line x1="22" y1="38" x2="46" y2="38" stroke="#555" strokeWidth="1.5" />
                    <line x1="24" y1="48" x2="40" y2="48" stroke="#555" strokeWidth="1.5" />
                </svg>
                <svg style={{ position: "absolute", right: 90, top: 80, width: 90, opacity: 0.10 }} viewBox="0 0 56 56">
                    <rect x="6" y="6" width="44" height="44" rx="2" fill="none" stroke="#444" strokeWidth="2" />
                    <line x1="6" y1="20" x2="50" y2="20" stroke="#444" strokeWidth="1.2" />
                    <line x1="6" y1="34" x2="50" y2="34" stroke="#444" strokeWidth="1.2" />
                    <line x1="20" y1="6" x2="20" y2="50" stroke="#444" strokeWidth="1.2" />
                    <line x1="34" y1="6" x2="34" y2="50" stroke="#444" strokeWidth="1.2" />
                </svg>
                <svg style={{ position: "absolute", right: 60, bottom: 180, width: 100, opacity: 0.10 }} viewBox="0 0 64 64">
                    <path d="M8 56 L32 8 L56 56 Z" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="40" x2="44" y2="40" stroke="#0F6E56" strokeWidth="1.2" />
                </svg>
                <div className={styles.ruler} style={{ position: "absolute", left: 80, bottom: 220, opacity: 0.12 }} />
            </div>

            {/* ── Layer 2 — mid distance ── */}
            <div ref={l2Ref} className={styles.layer}>
                <div className={styles.sticky} style={{ top: 70, right: 60 }}>
                    <div className={styles.stickyLine} />
                    <div className={styles.stickyLine} />
                    <div className={styles.stickyLine} />
                </div>
                <svg style={{ position: "absolute", left: 50, bottom: 170, width: 100, opacity: 0.16 }} viewBox="0 0 60 36">
                    <path d="M4 32 Q10 4 22 8 Q30 12 30 22 Q30 32 40 26 Q50 20 56 6" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <svg style={{ position: "absolute", right: 120, bottom: 120, width: 70, opacity: 0.14 }} viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="17" fill="none" stroke="#888" strokeWidth="2" />
                    <line x1="14" y1="22" x2="30" y2="22" stroke="#888" strokeWidth="1.5" />
                    <line x1="22" y1="14" x2="22" y2="30" stroke="#888" strokeWidth="1.5" />
                </svg>
                <div className={styles.shaving} style={{ width: 52, height: 22, left: 280, bottom: 200, transform: "rotate(22deg)", opacity: 0.18 }} />
                <div className={styles.shaving} style={{ width: 32, height: 16, left: 320, bottom: 180, transform: "rotate(-8deg)", opacity: 0.15 }} />
            </div>

            {/* ── Layer 3 — closest, fastest ── */}
            <div ref={l3Ref} className={styles.layer}>
                <div className={styles.eraser} style={{ bottom: 160, right: 90, opacity: 0.22 }} />
                <div className={styles.clip} style={{ top: 50, left: 130, opacity: 0.22 }} />
                <svg style={{ position: "absolute", left: 160, top: 70, width: 45, opacity: 0.20 }} viewBox="0 0 28 28">
                    <path d="M4 24 L14 4 L24 24" fill="none" stroke="#c8a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="8" y1="17" x2="20" y2="17" stroke="#c8a860" strokeWidth="1.5" />
                </svg>
                <svg style={{ position: "absolute", right: 50, top: 250, width: 50, opacity: 0.18 }} viewBox="0 0 32 32">
                    <path d="M6 26 Q10 6 16 8 Q22 10 24 20 Q26 28 16 26 Q6 24 6 26Z" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            </div>

            {/* ── Center logo — original design ── */}
            <div className={styles.center}>
                <div className={styles.logoMark}>
                    <svg viewBox="0 0 260 160" className={styles.svg} xmlns="http://www.w3.org/2000/svg">

                        <g className={styles.pageBack}>
                            <path d="M40,16 L116,10 L124,110 L48,116 Z" fill="#F1EFE8" stroke="#5F5E5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line className={styles.line1} x1="54" y1="38" x2="108" y2="35" stroke="#888780" strokeWidth="1.4" />
                            <line className={styles.line2} x1="54" y1="52" x2="108" y2="49" stroke="#888780" strokeWidth="1.4" />
                            <line className={styles.line3} x1="54" y1="66" x2="102" y2="63" stroke="#888780" strokeWidth="1.2" />
                            <line className={styles.line4} x1="54" y1="80" x2="96" y2="78" stroke="#888780" strokeWidth="1.2" />
                        </g>

                        <g className={styles.pageMid}>
                            <path d="M58,8 L136,8 L136,108 L58,108 Z" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M122,8 L136,22 L122,22 Z" fill="#5DCAA5" stroke="#0F6E56" strokeWidth="1.5" />
                            <line className={styles.fline1} x1="70" y1="36" x2="122" y2="36" stroke="#1D9E75" strokeWidth="1.4" />
                            <line className={styles.fline2} x1="70" y1="50" x2="122" y2="50" stroke="#1D9E75" strokeWidth="1.4" />
                            <line className={styles.fline3} x1="70" y1="64" x2="112" y2="64" stroke="#1D9E75" strokeWidth="1.2" />
                        </g>

                        <g className={styles.pageFront}>
                            <path d="M76,2 L154,2 L154,106 L76,106 Z" fill="#FAEEDA" stroke="#633806" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M140,2 L154,16 L140,16 Z" fill="#EF9F27" stroke="#633806" strokeWidth="1.6" />
                            <line className={styles.fline1} x1="88" y1="28" x2="142" y2="28" stroke="#854F0B" strokeWidth="1.5" />
                            <line className={styles.fline2} x1="88" y1="42" x2="142" y2="42" stroke="#854F0B" strokeWidth="1.5" />
                            <line className={styles.fline3} x1="88" y1="56" x2="134" y2="56" stroke="#854F0B" strokeWidth="1.3" />
                            <line className={styles.fline4} x1="88" y1="70" x2="142" y2="70" stroke="#854F0B" strokeWidth="1.2" />
                            <line className={styles.fline5} x1="88" y1="84" x2="128" y2="84" stroke="#854F0B" strokeWidth="1.2" />
                            <line className={styles.fline6} x1="88" y1="98" x2="136" y2="98" stroke="#854F0B" strokeWidth="1.0" />
                        </g>

                        <g className={styles.pencil}>
                            <path d="M158,2 L192,−6 L202,28 L168,36 Z" fill="#FAEEDA" stroke="#633806" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M168,36 L192,−6 L202,28 Z" fill="#F5C4B3" stroke="#633806" strokeWidth="1.5" />
                            <path d="M180,30 L185,12 L196,22 L180,30 Z" fill="#444441" stroke="#2C2C2A" strokeWidth="1" />
                            <line x1="158" y1="2" x2="162" y2="14" stroke="#0F6E56" strokeWidth="4" strokeLinecap="round" />
                        </g>

                    </svg>
                </div>

                <div className={styles.wordmark}>
                    <span className={styles.wordFile}>File</span>
                    <span className={styles.wordCraft}>Craft</span>
                </div>
                <p className={styles.tagline}>document processing, crafted for you</p>
                <div className={styles.dots}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                </div>
            </div>
        </div>
    );
}