import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./social.module.css";
//NOT FINAL AT ALL
interface Senior {
  id: number;
  name: string;
  username: string;
  year: number;
  major: string;
  modules: string[];
  bio: string;
  connected: boolean;
}

const MOCK_SENIORS: Senior[] = [
  {
    id: 1,
    name: "Aisha Tan",
    username: "aishatan",
    year: 3,
    major: "Computer Science",
    modules: ["CS2030S", "CS2040S", "CS3230"],
    bio: "Happy to help with DSA and OOP. DM me anytime!",
    connected: false,
  },
  {
    id: 2,
    name: "Marcus Lim",
    username: "marcuslim",
    year: 4,
    major: "Computer Science",
    modules: ["CS1010A", "MA1522", "CS2103T"],
    bio: "Final year. Survived CS1010A — you can too.",
    connected: true,
  },
  {
    id: 3,
    name: "Priya Nair",
    username: "priyanair",
    year: 3,
    major: "Information Systems",
    modules: ["IS1108", "MA1522", "CS1010A"],
    bio: "Love talking about system design and databases.",
    connected: false,
  },
  {
    id: 4,
    name: "Jordan Wu",
    username: "jordanwu",
    year: 2,
    major: "Computer Science",
    modules: ["CS2030S", "ST2334", "CS2100"],
    bio: "Just cleared Sem 2. Ask me about CS2030S.",
    connected: false,
  },
  {
    id: 5,
    name: "Natalie Seah",
    username: "natalieseah",
    year: 4,
    major: "Business Analytics",
    modules: ["BT1101", "MA1522", "ST2334"],
    bio: "BA + CS double. Reach out for module advice.",
    connected: true,
  },
  {
    id: 6,
    name: "Reuben Ong",
    username: "reubenong",
    year: 3,
    major: "Computer Engineering",
    modules: ["CS1010A", "CS2100", "EE2026"],
    bio: "CEG here — can help with both CS and EE mods.",
    connected: false,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#0b2d5a",
  "#1b3d6c",
  "#2d5f8a",
  "#3d7ba8",
  "#0f5a8a",
  "#1a4f6e",
];

export default function Social() {
  const navigate = useNavigate();
  const [seniors, setSeniors] = useState<Senior[]>(MOCK_SENIORS);
  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "connected">(
    "discover"
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleConnect = (id: number) => {
    setSeniors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, connected: !s.connected } : s))
    );
  };

  const allModules = Array.from(
    new Set(MOCK_SENIORS.flatMap((s) => s.modules))
  ).sort();

  const filtered = seniors.filter((s) => {
    const inTab =
      activeTab === "discover" ? !s.connected : s.connected;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.major.toLowerCase().includes(search.toLowerCase()) ||
      s.modules.some((m) =>
        m.toLowerCase().includes(search.toLowerCase())
      );
    const matchModule =
      filterModule === "" || s.modules.includes(filterModule);
    return inTab && matchSearch && matchModule;
  });

  const connectedCount = seniors.filter((s) => s.connected).length;

  return (
    <div className={styles["social-page"]}>
      <div className={styles["dashboard-container"]}>

        <div className={styles.topbar}>
          <div className={styles["topbar-title"]}>SyllaBuddy</div>
          <div className={styles["topbar-nav"]}>
            <button
              className={styles["nav-link"]}
              onClick={() => navigate("/timetable")}
            >
              Timetable
            </button>
            <button
              className={styles["nav-link-active"]}
              onClick={() => navigate("/social")}
            >
              Connect
            </button>
            <button className={styles["logout-btn"]} onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>

        <div className={styles["page-header"]}>
          <div>
            <h1 className={styles["page-title"]}>Find seniors</h1>
            <p className={styles["page-sub"]}>
              Connect with seniors who have taken your modules.
            </p>
          </div>
          <div className={styles["summary-pill"]}>
            <span className={styles["pill-num"]}>{connectedCount}</span>
            <span className={styles["pill-label"]}>connected</span>
          </div>
        </div>

        <div className={styles["controls-row"]}>
          <div className={styles["search-wrap"]}>
            <span className={styles["search-icon"]}>&#x2315;</span>
            <input
              className={styles["search-input"]}
              type="text"
              placeholder="Search by name, major, or module…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles["filter-select"]}
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
          >
            <option value="">All modules</option>
            {allModules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tabs}>
          <button
            className={
              activeTab === "discover" ? styles["tab-active"] : styles.tab
            }
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>
          <button
            className={
              activeTab === "connected" ? styles["tab-active"] : styles.tab
            }
            onClick={() => setActiveTab("connected")}
          >
            Connected
            {connectedCount > 0 && (
              <span className={styles["tab-badge"]}>{connectedCount}</span>
            )}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No seniors found matching your filters.</p>
          </div>
        ) : (
          <div className={styles["cards-grid"]}>
            {filtered.map((senior, idx) => (
              <div key={senior.id} className={styles.card}>
                <div className={styles["card-top"]}>
                  <div
                    className={styles.avatar}
                    style={{
                      background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                    }}
                  >
                    {getInitials(senior.name)}
                  </div>
                  <div className={styles["card-identity"]}>
                    <div className={styles["card-name"]}>{senior.name}</div>
                    <div className={styles["card-meta"]}>
                      Y{senior.year} · {senior.major}
                    </div>
                  </div>
                </div>

                <p className={styles["card-bio"]}>{senior.bio}</p>

                <div className={styles["module-list"]}>
                  {senior.modules.map((mod) => (
                    <span key={mod} className={styles["mod-tag"]}>
                      {mod}
                    </span>
                  ))}
                </div>

                <div className={styles["card-actions"]}>
                  <button
                    className={
                      senior.connected
                        ? styles["btn-connected"]
                        : styles["btn-connect"]
                    }
                    onClick={() => handleConnect(senior.id)}
                  >
                    {senior.connected ? "✓ Connected" : "Connect"}
                  </button>
                  {senior.connected && (
                    <button className={styles["btn-message"]}>Message</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}