import styles from "./navTab.module.css";

interface NavigationTabsProps {
  activeTab: "discover" | "connected";
  setActiveTab: (tab: "discover" | "connected") => void;
  connectedCount: number;
}

export default function NavigationTabs({ activeTab, setActiveTab, connectedCount }: NavigationTabsProps) {
  return (
    <div className={styles.container}>
      <button 
        className={`${styles.tab} ${activeTab === "discover" ? styles.active : ""}`} 
        onClick={() => setActiveTab("discover")}
      >
        Discover
      </button>
      <button 
        className={`${styles.tab} ${activeTab === "connected" ? styles.active : ""}`} 
        onClick={() => setActiveTab("connected")}
      >
        Connected <span className={styles.badge}>{connectedCount}</span>
      </button>
    </div>
  );
}