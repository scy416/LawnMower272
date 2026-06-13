import styles from "../Pages/userProfile/friendList.module.css";

interface FriendProps {
    friend: {
        id: number;
        username: string;
        major?: string; 
        mutualFriends?: number; 
    };
}

export default function FriendCard({ friend }: FriendProps) {
    const initials = friend.username.slice(0, 2).toUpperCase();

    return (
        <div className={styles['card']}>
            
            <div className={styles['avatar-wrapper']}>
                <div className={styles['avatar']}>
                    {initials}
                </div>
                <div className={styles['online-indicator']}></div>
            </div>

            <div className={styles['info']}>
                <p className={styles['name']}>{friend.username}</p>
                <p className={styles['muted-text']}>{friend.major || ""}</p>
                <p className={styles['muted-text']}>{friend.mutualFriends || 0} mutual friends</p>
            </div>

        </div>
    );
}