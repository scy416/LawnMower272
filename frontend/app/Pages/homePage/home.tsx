// Link is the React Router component for navigation between pages
// It renders as an <a> tag but handles routing without a full page reload
import { Link } from "react-router";

// Import the CSS file that styles this page
import "./home.css";

// Default export means this is the main component of the file
// React Router will render this when the user visits the "/" route
export default function Home() {
  return (
    // .home is the full-page wrapper — dark background, centered layout
    <div className="home">

      {/* Visual background layers — purely decorative, no content */}
      <div className="noise" />     {/* Grain/noise texture overlay */}
      <div className="grid-bg" />   {/* Subtle dot grid in the background */}

      {/* Main content block — everything the user actually sees */}
      <main className="center">

        {/* Small pill-shaped label above the logo */}
        <div className="badge">your schedule, simplified</div>

        {/* App name — uses a serif font for a refined look */}
        <h1 className="logo">
          SyllaBuddy
        </h1>

        {/* Short tagline below the logo */}
        <p className="tagline">
          Plan smarter. Study better. <br />
          Never miss a class again.
        </p>

        {/* Navigation buttons — Link navigates to the given route on click */}
        <div className="actions">
          {/* to="/login" means clicking goes to the /login route */}
          <Link to="/login" className="btn btn-primary">Log in</Link>

          {/* btn-secondary has a different style — outlined instead of filled */}
          <Link to="/signup" className="btn btn-secondary">Sign up free</Link>
        </div>

      </main>

      {/* Footer pinned to the bottom of the page */}
      <footer className="footer">
        {/* new Date().getFullYear() dynamically gets the current year */}
        © {new Date().getFullYear()} Syllabuddy
      </footer>

    </div>
  );
}