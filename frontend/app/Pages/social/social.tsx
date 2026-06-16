import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./social.module.css";
import SearchBar from "./searchBar";
import NavigationTabs from "./navTab";
import SeniorCard from "../../Components/seniorCard";
import { userAuth } from "~/hooks";

export default function Social() {
  const navigate = useNavigate();
  const [seniors, setSeniors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [activeTab, setActiveTab] = useState<"discover" | "connected">("discover");
 const { getToken } = userAuth()

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchSeniors = async () => {
      try {
        const res = await fetch("http://localhost:8000/social/discover", {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSeniors(data); 
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    };

    fetchSeniors();
  }, []);
  const handleConnect = async (targetUserId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/social/chat/${targetUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/chat/${data.conversation_id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles["social-page"]}>
      <div className={styles["dashboard-container"]}>

        <div className={styles.topbar}>
          <div className={styles["topbar-title"]}>SyllaBuddy</div>
          <div className={styles["nav-links"]}>
            <button className={styles["nav-btn"]} onClick={() => navigate("/timetable")}>Timetable</button>
            <button className={`${styles["nav-btn"]} ${styles["active"]}`}>Connect</button>
            <button className={styles["nav-btn"]} onClick={handleLogout}>Sign out</button>
          </div>
        </div>

        <div className={styles["header-row"]}>
          <div>
            <h1 className={styles["page-title"]}>Find seniors</h1>
            <p className={styles["page-subtitle"]}>Connect with seniors who have taken your modules.</p>
          </div>
        </div>

        <SearchBar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          selectedModule={selectedModule} setSelectedModule={setSelectedModule}
        />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} connectedCount={2} />
        <SeniorCard seniors={seniors} handleConnect={handleConnect} />

      </div>
    </div>
  );
}