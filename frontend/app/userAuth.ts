import { useNavigate } from "react-router";

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