import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:3000";

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
