import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";

export function RequireAuth({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return children;
}
