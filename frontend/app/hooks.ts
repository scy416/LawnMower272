import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { type Profile, type Friend } from "./types";

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

    return { getToken, handleUnauthorized };
}

export function getProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    
    const { getToken, handleUnauthorized } = userAuth();
    
    const loadProfileInfo = async() => {
        const token = getToken();
        if (!token) return;
    
        const res = await fetch("http://localhost:8000/profile/me", {
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

            const res = await fetch("http://localhost:8000/friends/friends_list", {
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