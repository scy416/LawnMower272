import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./social.module.css";
import SearchBar from "../../Components/searchBox";
import NavigationTabs from "./navTab";
import SeniorCard from "../../Components/seniorCard";
import { userAuth, getProfile, getFriends, getPendingRequests } from "../../hooks";
import { API_URL } from "~/config";

type Tab = "discover" | "friends" | "requests";

export default function Social() {
  const navigate = useNavigate();
  const [discoverUsers, setDiscoverUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUserCards, setSearchedUserCards] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("discover");

  const { getToken } = userAuth();
  const { loadProfileInfo } = getProfile();
  const { friends, refetch: refetchFriends } = getFriends();
  const { pendingRequests, refetch: refetchRequests } = getPendingRequests();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/"; 
  };

  useEffect(() => {
      loadProfileInfo();
      fetchDiscover();
      refetchFriends();  
      refetchRequests(); 
    }, []);
    
  useEffect(() => {
      if (activeTab === "friends") {
        refetchFriends();
      } else if (activeTab === "requests") {
        refetchRequests();
      }
    }, [activeTab]);

  const fetchDiscover = async () => {
    try {
      const res = await fetch(`${API_URL}/social/discover`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setDiscoverUsers(await res.json());
    } catch (err) {
      console.error("Failed to fetch discover:", err);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchedUserCards([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/social/api/search/profiles?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSearchedUserCards(data);
        }
      } catch (err) {
        console.error("Failed to search profiles:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, getToken]);

  const handleAddFriend = async (targetUserId: number) => {
    try {
      const res = await fetch(`${API_URL}/friends/requests/send/${targetUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.warn(errorData.detail || "Failed to send request");
      }
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const res = await fetch(`${API_URL}/friends/requests/accept/${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) refetchRequests();
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const res = await fetch(`${API_URL}/friends/requests/reject/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) refetchRequests();
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  };

  const handleStartChat = async (targetUserId: number) => {
    try {
      const res = await fetch(`${API_URL}/social/chat/${targetUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/chat/${data.conversation_id}`);
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    try {
      const res = await fetch(`${API_URL}/friends/delete/${friendId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        refetchFriends();
      }
    } catch (err) {
      console.error("Failed to remove friend:", err);
    }
  };

  const filteredFriends = (friends as any[]).filter((friend) => {
    if (!searchQuery) return true;
    return friend.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayedSeniors = searchQuery.trim() !== "" 
          ? searchedUserCards 
          : discoverUsers;

  return (
    <div className={styles["social-page"]}>
      <div className={styles["dashboard-container"]}>
        <div className={styles.topbar}>
          <div className={styles["topbar-title"]}>SyllaBuddy</div>
          <div className={styles["nav-links"]}>
            <button 
              className="nav-btn-global" 
              onClick={() => window.location.href = "/timetable"}
            >
              Home
            </button>
            <button className="nav-btn-global" onClick={handleLogout}>Sign out</button>
          </div>
        </div>

        <div className={styles["header-row"]}>
          <div>
            <h1 className={styles["page-title"]}>Connect</h1>
            <p className={styles["page-subtitle"]}>Discover users, manage friends, and handle requests.</p>
          </div>
        </div>

        <SearchBar 
          placeholder="Search all users by name..."
          buttonText="Search"
          onInputChange={(val) => setSearchQuery(val)} 
          onSelect={() => {}} 
          fetchSuggestions={async () => []} 
          hideDropdown={true} 

          containerClassName={styles["sb-container"]} 
          formClassName={styles["sb-form"]} 
          inputClassName={styles["sb-input"]} 
          buttonClassName={styles["sb-button"]}
          icon="🔍"
          iconClassName={styles["sb-icon"]}
          inputWrapperClassName={styles["sb-input-wrapper"]}
        />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={pendingRequests.length} />

        {activeTab === "discover" && (
          <>
            <SeniorCard seniors={displayedSeniors} handleAddFriend={handleAddFriend} />
            {displayedSeniors.length === 0 && (
              <p className={styles["empty-msg"]}>No users found.</p>
            )}
          </>
        )}

        {activeTab === "friends" && (
          <div className={styles["friends-list"]}>
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend: any) => (
                <div key={friend.id} className={styles["friend-row"]}>
                  <div className={styles["friend-avatar"]}>
                    {friend.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className={styles["friend-name"]}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/Profile/${friend.id}`)}
                  >
                    {friend.username}
                  </span>
                  <div className={styles["request-actions"]}>
                    <button
                      className={styles["grey-btn"]}
                      onClick={() => handleStartChat(friend.id)}
                    >
                      Message
                    </button>
                    <button
                      className={styles["reject-btn"]}
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles["empty-msg"]}>
                {searchQuery ? "No friends match your search." : "You have no friends yet. Go discover some!"}
              </p>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className={styles["friends-list"]}>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req: any) => (
                <div key={req.request_id} className={styles["request-row"]}>
                  <div className={styles["friend-avatar"]}>
                    {req.sender_username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={styles["friend-name"]}>{req.sender_username}</span>
                  <div className={styles["request-actions"]}>
                    <button className={styles["accept-btn"]} onClick={() => handleAcceptRequest(req.request_id)}>
                      Accept
                    </button>
                    <button className={styles["reject-btn"]} onClick={() => handleRejectRequest(req.request_id)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles["empty-msg"]}>No pending friend requests.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}