import styles from "./PageLoader.module.css";

export default function PageLoader() {
    return (
        <div className={styles.wrap}>
            <div className={styles.pencil}>
                <div className={styles.pencilEraser} />
                <div className={styles.pencilBody} />
                <div className={styles.pencilTip} />
                <div className={styles.pencilNib} />
            </div>
            <p className={styles.label}>loading...</p>
            <div className={styles.dots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
            </div>
        </div>
    );
}