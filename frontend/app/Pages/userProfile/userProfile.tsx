import { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./userProfile.module.css";
import { getProfile } from "../../hooks"

export default function UserProfile() {
    const navigate = useNavigate()
    const { profile, loadProfileInfo } = getProfile()

    useEffect(() => {
        loadProfileInfo();
    },[]);

    return (
         <div className={styles['page']}>
            {profile ? (
                <div className={styles['card']}>

                    <div className={styles['top']}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>

                            <div className={styles['avatar']}> {/* future: change this to allow images ig? */}
                                {profile.username.slice(0, 2).toUpperCase()}
                            </div>

                            <div className={styles['info']}>
                                <p className={styles['name']}>{profile.username}</p>
                                <p className={styles['muted']}>{profile.major} · Year {profile.year}</p>
                                <p className={styles['muted']}>{profile.bio}</p>
                            </div>
                            
                        </div>

                        <button className={styles['edit-btn']} onClick={() => navigate("/profile/edit")}>
                            Edit profile
                        </button>
                    </div>

                    <div className={styles['meta']}>
                        <span className={styles['muted']}>{profile.email}</span>
                    </div>

                    <div className={styles['stats']}>
                        <div>
                            <span className={styles['stat-num']}>0</span> {/* placeholder */}
                            <span className={styles['muted']}> friends</span>
                        </div>
                    </div>

                </div>
            ) : (
                <p className={styles['muted']}>Loading...</p>
            )}
        </div>
    );
}