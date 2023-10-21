import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className='w-full h-full fixed top-0 left-0 flex flex-col items-center justify-center bg-[#fcfcfc] z-[1000]'>
            <div className={styles.book}>
                <div className={styles.book__pg_shadow}></div>
                <div className={styles.book__pg}></div>
                <div className={`${styles.book__pg} ${styles.book__pg__2}`}></div>
                <div className={`${styles.book__pg} ${styles.book__pg__3}`}></div>
                <div className={`${styles.book__pg} ${styles.book__pg__4}`}></div>
                <div className={`${styles.book__pg} ${styles.book__pg__5}`}></div>
            </div>
        </div>
    );
}