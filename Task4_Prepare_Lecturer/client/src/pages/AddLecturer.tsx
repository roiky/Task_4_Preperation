import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RatingInput from "../components/RatingInput";
import { Button } from "@mui/material";

type Skills = {
    react: number;
    node: number;
    angular: number;
    dotnet: number;
    microservices: number;
    microfrontends: number;
    ai: number;
    docker: number;
};

export default function AddLecturer() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [skills, setSkills] = useState<Skills>({
        react: 0,
        node: 0,
        angular: 0,
        dotnet: 0,
        microservices: 0,
        microfrontends: 0,
        ai: 0,
        docker: 0,
    });
    const [loading, setLoading] = useState(false);

    function setSkill<K extends keyof Skills>(k: K, v: number) {
        setSkills((prev) => ({ ...prev, [k]: v }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            alert("Name is required");
            return;
        }

        // client-side basic range check
        for (const k of Object.keys(skills) as (keyof Skills)[]) {
            const v = skills[k];
            if (!Number.isFinite(v) || v < 0 || v > 10) {
                alert(`${k} must be between 0 and 10`);
                return;
            }
        }

        setLoading(true);
        try {
            await api.post("/api/lecturers", { name: trimmed, skills });
            alert("Lecturer added successfully");
            navigate("/lecturers");
        } catch (err: any) {
            if (err?.response?.status === 409) {
                //server return status 409 for exist lecturer
                alert("Lecturer already exists");
            } else if (err?.response?.status === 400) {
                alert("Invalid data — please check the inputs");
            } else {
                console.error("Create lecturer error:", err);
                alert("Error creating lecturer");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card">
            <h2>Add Lecturer</h2>
            <form onSubmit={onSubmit}>
                <div className="field">
                    <label>Lecturer Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="grid">
                    <RatingInput label="React" value={skills.react} onChange={(v) => setSkill("react", v)} />
                    <RatingInput label="Node" value={skills.node} onChange={(v) => setSkill("node", v)} />
                    <RatingInput label="Angular" value={skills.angular} onChange={(v) => setSkill("angular", v)} />
                    <RatingInput label=".NET" value={skills.dotnet} onChange={(v) => setSkill("dotnet", v)} />
                    <RatingInput
                        label="Microservices"
                        value={skills.microservices}
                        onChange={(v) => setSkill("microservices", v)}
                    />
                    <RatingInput
                        label="Microfrontends"
                        value={skills.microfrontends}
                        onChange={(v) => setSkill("microfrontends", v)}
                    />
                    <RatingInput label="AI" value={skills.ai} onChange={(v) => setSkill("ai", v)} />
                    <RatingInput label="Docker" value={skills.docker} onChange={(v) => setSkill("docker", v)} />
                </div>

                <div className="actions" style={{ marginTop: "10px" }}>
                    <Button style={{ fontSize: "12px" }} size="small" variant="contained" color="secondary" type="submit">
                        {loading ? "Saving..." : "Add Lecturer"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
