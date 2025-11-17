import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import Display404 from "./404";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    //if (!user) return <Navigate to="/login" replace />;
    if (!user) return <Display404 />;
    if (user.role !== "admin") return <Display404 />;
    return children;
}
