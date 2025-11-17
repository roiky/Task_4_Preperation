import { promise } from "zod";
import api from "./api";

export type Skills = {
    react: number;
    node: number;
    angular: number;
    dotnet: number;
    microservices: number;
    microfrontends: number;
    ai: number;
    docker: number;
};

export type Lecturer = {
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
    updated_at?: string;
};

export type CreateLecturerPayload = {
    name: string;
    skills: Skills;
};

export async function fetchLecturers(): Promise<Lecturer[]> {
    const res = await api.get<Lecturer[]>("/api/lecturers");
    return res.data;
}

export async function deleteLecturer(id: number): Promise<void> {
    await api.delete(`/api/lecturers/${id}`);
}

export async function postLecturer(name: string, skills: Skills): Promise<Lecturer[]> {
    const res = await api.post(`/api/lecturers`, { name, skills });
    return res.data;
}
