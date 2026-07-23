import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userAuth } from "~/hooks";
import styles from "./forum.module.css";
import { API_URL } from "~/config";

interface ModuleInfo {
  module_code: string;
  review_count: number;
  avg_rating: number;
}

function renderStars(avg: number) {
  const full = Math.round(avg);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export default function ForumHome() {
  const navigate = useNavigate();
  const { getToken, handleUnauthorized } = userAuth();

  const [search, setSearch] = useState("");
  const [allModules, setAllModules] = useState<ModuleInfo[]>([]);
  const [userModules, setUserModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const forumRes = await fetch(`${API_URL}/forum/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (forumRes.status === 401) { handleUnauthorized(); return; }
        if (forumRes.ok) setAllModules(await forumRes.json());

        const timetableRes = await fetch(`${API_URL}/api/timetable`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (timetableRes.status === 401) { handleUnauthorized(); return; }

        if (timetableRes.ok) {
          const assignments: any[] = await timetableRes.json();
          const codes: string[] = [];
          assignments.forEach((a) => {
            if (!codes.includes(a.module_code)) codes.push(a.module_code);
          });
          setUserModules(codes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const searchTrimmed = search.trim().toUpperCase();

  // users can review modules not added to their timetable
  const filtered = allModules.filter((m) => m.module_code.includes(searchTrimmed));
  const displayModules = searchTrimmed
    ? filtered.length > 0
      ? filtered.map((m) => ({ code: m.module_code, info: m }))
      : [{ code: searchTrimmed, info: undefined }]
    : userModules.map((code) => ({
        code,
        info: allModules.find((m) => m.module_code === code),
      }));

  const ModuleRow = ({ code, info }: { code: string; info?: ModuleInfo }) => (
    <div className={styles["module-row"]} onClick={() => navigate(`/forum/${code}`)}>
      <span className={styles["module-code"]}>{code}</span>
      <div className={styles["module-meta"]}>
        {info ? (
          <>
            <span className={styles["avg-stars"]}>
              {renderStars(info.avg_rating)} {info.avg_rating.toFixed(1)}
            </span>
            <span className={styles["review-count"]}>
              {info.review_count} review{info.review_count !== 1 ? "s" : ""}
            </span>
          </>
        ) : (
          <span className={styles["review-count"]}>No reviews yet</span>
        )}
        <span style={{ color: "#94a3b8", fontSize: "16px" }}>›</span>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <div className={styles["topbar-title"]}>SyllaBuddy Forum</div>
          <div className={styles["nav-links"]}>
            <button className="nav-btn-global" onClick={() => navigate("/timetable")}>
              Home
            </button>
            <button className="nav-btn-global" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>

        <div className={styles["page-header"]}>
          <div className={styles["page-title"]}>Module Forum</div>
          <div className={styles["page-subtitle"]}>Browse reviews and ratings for NUS modules.</div>
        </div>

        <div className={styles["search-wrap"]}>
          <span className={styles["search-icon"]}>🔍</span>
          <input
            className={styles["search-input"]}
            placeholder="Search any module code (e.g. CS2103T)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className={styles.empty}>Loading...</p>
        ) : (
          <>
            <div className={styles["section-label"]}>
              {searchTrimmed ? "Search Results" : "Your Enrolled Modules"}
            </div>

            {displayModules.length === 0 ? (
              <p className={styles.empty}>
                {searchTrimmed
                  ? "No modules found matching your search."
                  : "You haven't added any modules to your timetable yet."}
              </p>
            ) : (
              <div className={styles["module-list"]}>
                {displayModules.map(({ code, info }) => (
                  <ModuleRow key={code} code={code} info={info} />
                ))}
              </div>
            )}

            {searchTrimmed && userModules.length > 0 && (
              <>
                <div className={styles["section-label"]} style={{ marginTop: "24px" }}>
                  Your Modules
                </div>
                <div className={styles["module-list"]}>
                  {userModules
                    .filter((c) => !c.includes(searchTrimmed))
                    .map((code) => (
                      <ModuleRow
                        key={code}
                        code={code}
                        info={allModules.find((m) => m.module_code === code)}
                      />
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
