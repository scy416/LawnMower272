import UserProfile from "./userProfile";        
import LowerInterface from "./lowerInterface";   
import styles from "./userProfile.module.css";   

export default function MainProfile() {          
    return (
        <div className={styles['page']}>
            <div style={{ width: "100%", maxWidth: "1400px" }}>
                <UserProfile />
                <LowerInterface />
            </div>
        </div>
    )
}