import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/auth/profile");
            setUser(res.data.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const login = async (credentials) => {
        const res = await api.post("/auth/login", credentials);

        if (res.data.token) {
            localStorage.setItem("token", res.data.token);
        }
        const profileRes = await api.get("/auth/profile");
        setUser(profileRes.data.data);

        return profileRes.data.data;
    };

    const register = async (credentials) => {
        const res = await api.post("/auth/register", credentials);
        if (res.data.token) {
            localStorage.setItem("token", res.data.token);
        }
        await fetchProfile();
    };

    const logout = async () => {
        await api.post("/auth/logout");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
