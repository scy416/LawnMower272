import styles from "./navTab.module.css";

type Tab = "discover" | "friends" | "requests";

interface NavigationTabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  pendingCount: number;
}

export default function NavigationTabs({ activeTab, setActiveTab, pendingCount }: NavigationTabsProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.tab} ${activeTab === "discover" ? styles.active : ""}`}
        onClick={() => setActiveTab("discover")}
      >
        Discover
      </button>
      <button
        className={`${styles.tab} ${activeTab === "friends" ? styles.active : ""}`}
        onClick={() => setActiveTab("friends")}
      >
        Friends
      </button>
      <button
        className={`${styles.tab} ${activeTab === "requests" ? styles.active : ""}`}
        onClick={() => setActiveTab("requests")}
      >
        Friend Requests
        {pendingCount > 0 && (
          <span className={styles.badge}>{pendingCount}</span>
        )}
      </button>
    </div>
  );
}