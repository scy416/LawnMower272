import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "../userProfile/userProfile.module.css";
import { userAuth } from "../../hooks";

interface PublicProfileData {
  username: string;
  major: string | null;
  year: number | null;
  bio: string | null;
  modulesTaken?: string[];
  modulesToTake?: string[];
}

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getToken } = userAuth();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`http://localhost:8000/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProfile(await res.json());
      } else {
        setNotFound(true);
      }
    };
    load();
  }, [userId]);

  if (notFound) return <p className={styles["muted"]}>User not found.</p>;
  if (!profile) return <p className={styles["muted"]}>Loading...</p>;

  return (
    <div className={styles["card"]}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button
          onClick={() => navigate("/social")}
          className={styles["home-btn"]}
        >
          Back
        </button>
      </div>

      <div className={styles["header-container"]}>
        <div className={styles["avatar"]}>
          {profile.username.slice(0, 2).toUpperCase()}
        </div>
        <h2 className={styles["username"]}>{profile.username}</h2>
        <p className={styles["muted"]}>
          {profile.major || "No major set"} · {profile.year ? `Year ${profile.year}` : "No year set"}
        </p>
      </div>

      <div className={styles["edit-form"]} style={{ marginTop: "24px" }}>
        {profile.bio && (
          <div className={styles["field"]}>
            <label className={styles["label"]}>Bio</label>
            <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>{profile.bio}</p>
          </div>
        )}

        {profile.modulesTaken && profile.modulesTaken.length > 0 && (
          <div className={styles["field"]}>
            <label className={styles["label"]}>Modules Taken</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {profile.modulesTaken.map((mod) => (
                <span key={mod} className={styles["module-pill"]}>{mod}</span>
              ))}
            </div>
          </div>
        )}

        {profile.modulesToTake && profile.modulesToTake.length > 0 && (
          <div className={styles["field"]}>
            <label className={styles["label"]}>Modules to Take</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {profile.modulesToTake.map((mod) => (
                <span key={mod} className={styles["module-pill-active"]}>{mod}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
