import { useState } from "react";

import FriendsList from "./friendList"; 
import styles from "./lowerInterface.module.css"


export default function LowerInterface() {
    const [activeTab, setActiveTab] = useState("friends");

    return (
        <div className={styles['tabs-wrapper']}>
            <div className={styles['tab-headers']}>
                <button 
                    className={activeTab === "friends" ? styles['active'] : ""} 
                    onClick={() => setActiveTab("friends")}
                >
                    Friends (no of friends)
                </button>
                <button 
                    className={activeTab === "courses" ? styles['active'] : ""} 
                    onClick={() => setActiveTab("courses")}
                >
                    Courses
                </button>
                <button 
                    className={activeTab === "tab3" ? styles['active'] : ""} 
                    onClick={() => setActiveTab("tab3")}
                >
                    Interests
                </button>
            </div>

            <div className={styles['tab-content']}>
                {activeTab === "friends" && <FriendsList />}
                {activeTab === "courses" && (
                    <div className={styles['placeholder']}>
                        <p>Courses feature is currently under construction!</p>
                    </div>
                )}

                {activeTab === "tab3" && (
                    <div className={styles['placeholder']}>
                        <p>Idk what to put here</p>
                    </div>
                )}
            </div>

        </div>
    );
}