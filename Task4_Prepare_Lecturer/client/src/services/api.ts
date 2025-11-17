import axios, { AxiosInstance } from "axios";

const BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) ?? "http://localhost:3000";

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers = config.headers ?? {};
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        } catch (error) {
            console.log(error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// api.interceptors.response.use(
//     (res) => res,
//     (error) => {
//         const status = error?.response?.status;
//         if (status === 401) {
//             try {
//                 localStorage.removeItem("token");
//             } catch (e) {}
//             if (typeof window !== "undefined") {
//                 // שלח ל-login — ניתן להחליף ל־history push או לקרוא ל־AuthContext.logout()
//                 window.location.href = "/login";
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export function setAuthToken(token: string | null) {
    try {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    } catch (error) {
        console.log(error);
    }
}

export default api;
