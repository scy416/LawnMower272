import { useNavigate } from "react-router";
import { useState } from "react";
import { type Profile } from "./types";

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