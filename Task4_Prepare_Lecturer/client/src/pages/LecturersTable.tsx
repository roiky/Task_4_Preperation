import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Button } from "@mui/material";
import { deleteLecturer, fetchLecturers } from "../services/lecturers.services";

type Lecturer = {
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
    created_at: string;
};

export default function LecturersTable() {
    const [list, setList] = useState<Lecturer[]>([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            // const res = await api.get("/api/lecturers");
            const res = await fetchLecturers();
            setList(res);
        } catch (err) {
            console.error("Failed to load lecturers:", err);
            alert("Failed to load lecturers");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onDelete(id: number) {
        if (!confirm("Delete this lecturer?")) return;
        try {
            await deleteLecturer(id); // <-- delete service that returns void / throws on error
            await load(); // <-- reload the list after successful delete
            alert(`Lecturer ID:${id} deleted`);
        } catch (err: any) {
            console.error("Delete failed:", err);
            if (err?.response?.status === 404) alert("Lecturer not found");
            else alert("Failed to delete");
        } finally {
        }
    }

    return (
        <div className="card">
            <h2>Lecturers</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>React</th>
                            <th>Node</th>
                            <th>Angular</th>
                            <th>.NET</th>
                            <th>Microservices</th>
                            <th>Microfrontends</th>
                            <th>AI</th>
                            <th>Docker</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((l) => (
                            <tr key={l.id}>
                                <td>{l.name}</td>
                                <td>{l.skills_react}</td>
                                <td>{l.skills_node}</td>
                                <td>{l.skills_angular}</td>
                                <td>{l.skills_dotnet}</td>
                                <td>{l.skills_microservices}</td>
                                <td>{l.skills_microfrontends}</td>
                                <td>{l.skills_ai}</td>
                                <td>{l.skills_docker}</td>
                                <td>
                                    <Button
                                        style={{ fontSize: "12px", margin: 5 }}
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => onDelete(l.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr>
                                <td colSpan={10} style={{ textAlign: "center", padding: 20 }}>
                                    No lecturers yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
