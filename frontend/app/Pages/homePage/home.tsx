// Link is the React Router component for navigation between pages
// It renders as an <a> tag but handles routing without a full page reload
import { Link } from "react-router";

// Import the CSS Modules file that styles this page
import styles from "./home.module.css";

// Default export means this is the main component of the file
// React Router will render this when the user visits the "/" route
export default function Home() {
  return (
    // Uses CSS Module class names
    <div className={styles.home}>

      {/* Main content block — everything the user actually sees */}
      <main className={styles.center}>

        {/* App name */}
        <h1 className={styles.logo}>
          SyllaBuddy
        </h1>

        {/* Short tagline below the logo */}
        <p className={styles.tagline}>
          Plan smarter. Study better. <br />
          Never miss a deadline again.
        </p>

        {/* Navigation buttons — Link navigates to the given route on click */}
        <div className={styles.actions}>
          {/* to="/login" means clicking goes to the /login route */}
          <Link to="/login" className={`${styles.btn} ${styles['btn-primary']}`}>Log in</Link>

          {/* btn-secondary has a different style — outlined instead of filled */}
          <Link to="/signup" className={`${styles.btn} ${styles['btn-secondary']}`}>Sign up free</Link>
        </div>

      </main>

    </div>
  );
}