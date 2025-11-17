import { expect } from "chai";
import axios from "axios";
import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:3000";

const axiosInstanceApi = axios.create({
    baseURL: BASE_URL,
});

describe("API Health-Check", () => {
    it("[Health Check] /hc - health check", async () => {
        const res = await axiosInstanceApi.get(`${BASE_URL}/hc`, {});
        expect(res.status).to.equal(200);
        expect(res.data).to.include("Vacations API is running!");
    });
});
