import api, { setAuthToken } from "./api";

const baseUrl = "http://localhost:3000";

export async function registerApi(payload: { first_name: string; last_name: string; email: string; password: string }) {
    const { data } = await api.post("/auth/register", payload);
    return data;
}

export async function loginApi({ email, password }: { email: string; password: string }) {
    const { data } = await api.post("/auth/login", { email, password });
    if (!data?.token) throw new Error("No token returned");
    setAuthToken(data.token);
}

export function logout() {
    setAuthToken(null);
}

export function isAuthenticated() {
    return !!localStorage.getItem("token");
}
