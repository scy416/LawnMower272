import { Link } from "react-router";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <main className={styles.center}>
        <h1 className={styles.logo}>
          SyllaBuddy
        </h1>

        <p className={styles.tagline}>
          Plan smarter. Study better. <br />
          Never miss a deadline again.
        </p>

        <div className={styles.actions}>
          <Link to="/login" className={`${styles.btn} ${styles['btn-primary']}`}>Log in</Link>
          <Link to="/signup" className={`${styles.btn} ${styles['btn-secondary']}`}>Sign up free</Link>
        </div>
      </main>
    </div>
  );
}