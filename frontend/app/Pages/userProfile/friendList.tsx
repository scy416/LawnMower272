import FriendCard from "../../Components/friendCard";
import styles from "./friendList.module.css";
import { Plus } from "lucide-react";
import { getFriends } from "~/hooks";

export default function FriendsList() {
    const { friends, isLoading, error } = getFriends();
    if (isLoading) return <p className={styles['muted-text']}>Loading friends...</p>;
    if (error) return <p className={styles['muted-text']}>Error: {error}</p>;

    return (
        <div>
            <div className={styles['header']}>
                <h3 className={styles['title']}>Your Friends</h3>
                <button className={styles['find-btn']}>
                    <Plus size={16} />
                    Find Friends
                </button>
            </div>

            {friends.length === 0 ? (
                <p className={styles['muted-text']}>You don't have any friends yet.</p>
            ) : (
                <div className={styles['grid']}>
                    {friends.map((friend) => (
                        <FriendCard key={friend.id} friend={friend} />
                    ))}
                </div>
            )}
        </div>
    );
}