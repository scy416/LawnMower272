import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { type Profile, type Friend } from "./types";
import { API_URL } from "./config";

export function userAuth() {
    const navigate = useNavigate();

    const getToken = (): string | null => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
            return null;
        }
        return token;
    };

    const handleUnauthorized = () => {
        localStorage.removeItem("access_token");
        navigate("/login");
    };

    const getUserId = (): number | null => {
        const token = getToken();
        if (!token) return null;
        try {
            const payload = JSON.parse(window.atob(token.split('.')[1]));
            return parseInt(payload.sub, 10);
        } catch (e) {
            console.error("Failed to decode token", e);
            return null;
        }
    };

    return { getToken, getUserId, handleUnauthorized };
}

export function getProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    
    const { getToken, handleUnauthorized } = userAuth();
    
    const loadProfileInfo = async() => {
        const token = getToken();
        if (!token) return;
    
        const res = await fetch(`${API_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
            handleUnauthorized();
            return;
        }
        if (res.ok){
            const data = await res.json();
            setProfile(data);
            return data;
        }

        return null;
    };
    
    return { profile, loadProfileInfo }
}

export function getFriends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getToken, handleUnauthorized } = userAuth();

    const getFriendList = async() => {
        setIsLoading(true);
        setError(null)

        try{
            const token = getToken();

            const res = await fetch(`${API_URL}/friends/friends_list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                    }
                });

            if (res.status === 401) {
                handleUnauthorized();
                return;
                }

            if (!res.ok) {
                    throw new Error("Failed to fetch friends list");
                }

            const data = await res.json();
            setFriends(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getFriendList();
    },[])

    return { friends, isLoading, error, refetch: getFriendList };
}

export function getPendingRequests() {
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { getToken, handleUnauthorized } = userAuth();

    const fetchPendingRequests = async () => {
        setIsLoading(true);
        try {
            const token = getToken();
            if (!token) return;

            const res = await fetch(`${API_URL}/friends/requests/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 401) {
                handleUnauthorized();
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setPendingRequests(data);
            }
        } catch (err) {
            console.error("Failed to fetch pending requests:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    return { pendingRequests, isLoading, refetch: fetchPendingRequests };
}

export function getInbox() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { getToken, handleUnauthorized } = userAuth();

    const fetchInbox = async () => {
        setIsLoading(true);
        try {
            const token = getToken();
            if (!token) return;

            const res = await fetch(`${API_URL}/inbox/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 401) {
                handleUnauthorized();
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (err) {
            console.error("Failed to fetch inbox:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInbox();
    }, []);

    return { conversations, isLoading, refetch: fetchInbox };
}