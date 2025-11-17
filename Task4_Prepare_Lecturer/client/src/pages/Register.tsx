import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../services/auth.service";

const registerSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function RegisterPage() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);

    // NEW: touched flags + submitAttempted
    const [touched, setTouched] = useState({
        first_name: false,
        last_name: false,
        email: false,
        password: false,
    });
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const navigate = useNavigate();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError(null);
        setSubmitAttempted(true); // show errors after first submit attempt

        const parsed = registerSchema.safeParse({ first_name, last_name, email, password });
        if (!parsed.success) {
            setServerError("Validation failed");
            return;
        }

        try {
            setSubmitting(true);
            await registerApi(parsed.data);
            navigate("/login");
        } catch (error) {
            setServerError("Registration failed");
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        first_name && last_name && email && password ? setCanSubmit(false) : setCanSubmit(true);
    }, [first_name, last_name, email, password]);

    // small helpers
    const showError = (field: "first_name" | "last_name" | "email" | "password") => {
        return touched[field] || submitAttempted;
    };

    return (
        <div className="card" style={{ maxWidth: 480, margin: "30px auto", padding: 16 }}>
            <h2>Register</h2>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                <label>
                    First name
                    <input
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, first_name: true }))}
                    />
                    {showError("first_name") && !first_name && (
                        <div style={{ color: "red", fontSize: "small", marginBottom: 12 }}>first name is required!</div>
                    )}
                </label>

                <label>
                    Last name
                    <input
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, last_name: true }))}
                    />
                    {showError("last_name") && !last_name && (
                        <div style={{ color: "red", fontSize: "small", marginBottom: 12 }}>last name is required!</div>
                    )}
                </label>

                <label>
                    Email
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    />
                    {showError("email") && !email && (
                        <div style={{ color: "red", fontSize: "small", marginBottom: 12 }}>email is required!</div>
                    )}
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    />
                    {showError("password") && password.length < 4 && (
                        <div style={{ color: "red", fontSize: "small", marginBottom: 12 }}>password is too short!</div>
                    )}
                </label>

                {serverError && <div style={{ color: "red", fontSize: "small", marginBottom: 12 }}>{serverError}</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 20, alignItems: "center" }}>
                    <div>
                        <button type="submit" disabled={canSubmit || submitting}>
                            {submitting ? "Registering…" : "Register"}
                        </button>
                    </div>
                    <div>
                        <a style={{ fontSize: "small" }} onClick={() => navigate("/login")}>
                            Already have an account? Login here!
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
}
