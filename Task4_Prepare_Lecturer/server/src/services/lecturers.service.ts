import getConnection from "../db";
import type { OkPacket, ResultSetHeader } from "mysql2";

export type LecturerRow = {
    id: number;
    name: string;
    skills_react: number;
    skills_node: number;
    skills_angular: number;
    skills_dotnet: number;
    skills_microservices: number;
    skills_microfrontends: number;
    skills_ai: number;
    skills_docker: number;
    created_at: Date;
    updated_at: Date;
};

export async function findAll(): Promise<LecturerRow[]> {
    try {
        const pool = await getConnection();
        const [rows] = await pool.query(
            `SELECT id, name, skills_react, skills_node, skills_angular, skills_dotnet,
            skills_microservices, skills_microfrontends, skills_ai, skills_docker,
            created_at, updated_at
     FROM lecturers
     ORDER BY created_at DESC`
        );
        return rows as LecturerRow[];
    } catch (error) {
        console.error(`error while trying to get lecturers`);
        throw error;
    }
}

export async function findByNameInsensitive(name: string): Promise<LecturerRow | undefined> {
    try {
        const pool = await getConnection();
        const [rows] = await pool.query(`SELECT * FROM lecturers WHERE LOWER(name) = LOWER(?) LIMIT 1`, [name]);
        return (rows as LecturerRow[])[0];
    } catch (error) {
        console.error(`error while trying to get lecturers by name`);
        throw error;
    }
}

export async function findById(id: number): Promise<LecturerRow | undefined> {
    try {
        const pool = await getConnection();
        const [rows] = await pool.query(`SELECT * FROM lecturers WHERE id = ? LIMIT 1`, [id]);
        return (rows as LecturerRow[])[0];
    } catch (error) {
        console.error(`error while trying to get lecturers by ID`);
        throw error;
    }
}

export async function createLecturer(payload: {
    name: string;
    skills: {
        react: number;
        node: number;
        angular: number;
        dotnet: number;
        microservices: number;
        microfrontends: number;
        ai: number;
        docker: number;
    };
}): Promise<number> {
    try {
        const conn = await getConnection();
        const sql = `
    INSERT INTO lecturers
      (name, skills_react, skills_node, skills_angular, skills_dotnet, skills_microservices, skills_microfrontends, skills_ai, skills_docker, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
        const params = [
            payload.name,
            payload.skills.react,
            payload.skills.node,
            payload.skills.angular,
            payload.skills.dotnet,
            payload.skills.microservices,
            payload.skills.microfrontends,
            payload.skills.ai,
            payload.skills.docker,
        ];

        const [result]: any = await conn.execute(sql, params);
        return result.insertId as number;
    } catch (error) {
        console.error(`error while trying to create lecturer`);
        throw error;
    }
}

export async function deleteById(id: number): Promise<boolean> {
    try {
        const conn = await getConnection();
        const sql = `DELETE FROM lecturers WHERE id = ?`;
        const params = [id];
        const [result]: any = await conn.execute(sql, params);
        return (result as any).affectedRows > 0;
    } catch (error) {
        console.error(`error while trying to delete lecturer by ID`);
        throw error;
    }
}
