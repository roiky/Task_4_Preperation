import dotenv from "dotenv";
dotenv.config();

import mysql2 from "mysql2/promise";
import axios from "axios";
import { expect } from "chai";

export const BASE_URL = "http://localhost:3000";

export async function getDbConnection() {
    return mysql2.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.PASSWORD || "root",
        database: process.env.DATABASE || "vacations_app",
        port: Number(process.env.DB_PORT) || 3306,
    });
}

export function randomEmail() {
    return `test${Date.now()}${Math.floor(Math.random() * 9999)}@roeik.com`;
}

export async function registerViaApi(payload) {
    return await axios.post(`${BASE_URL}/auth/register`, payload);
}

export async function loginViaApi(payload) {
    //const { data } = await axios.post(`${BASE_URL}/auth/login`, payload);
    return await axios.post(`${BASE_URL}/auth/login`, payload);
}

export function axiosWithToken(token) {
    const inst = axios.create({ baseURL: BASE_URL });
    inst.interceptors.request.use((cfg) => {
        cfg.headers = cfg.headers || {};
        cfg.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        return cfg;
    });
    return inst;
}

export async function deleteUserByEmail(email) {
    const conn = await getDbConnection();
    await conn.execute(`DELETE FROM vacations_app.users WHERE email = ?`, [email]);
    await conn.end();
}
