import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";

type User = {
    userId: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
} | null;

type AuthContextValue = {
    user: User;
    loading: boolean;
    loginFromToken: () => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    async function loginFromToken() {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        setAuthToken(token);

        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user ?? null);
        } catch (err) {
            setUser(null);
            setAuthToken(null);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loginFromToken();
    }, []);

    function logout() {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("token");
    }

    return <AuthContext.Provider value={{ user, loading, loginFromToken, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
