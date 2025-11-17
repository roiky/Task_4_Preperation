import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool: mysql2.Pool | null = null;

async function getConnection() {
    if (!pool) {
        pool = mysql2.createPool({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || process.env.USER || "root",
            password: process.env.DB_PASSWORD || process.env.PASSWORD || "root",
            database: process.env.DB_NAME || process.env.DATABASE || "lecturers_db",
            port: Number(process.env.DB_PORT || 3306),
            connectionLimit: 10,
            waitForConnections: true,
        });
    }
    return pool;
}

export default getConnection;
