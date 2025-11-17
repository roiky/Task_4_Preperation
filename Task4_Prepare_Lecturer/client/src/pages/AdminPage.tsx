import React, { useEffect, useState } from "react";
import VacationCard, { VacationRow } from "../components/VacationCard";
import VacationFormModalMUI from "../components/VacationFormModal";
import { fetchVacations } from "../services/vacations.service";
import {
    createVacationAdmin,
    updateVacationAdmin,
    deleteVacationAdmin,
    getCSV,
    getFollowersJSON,
} from "../services/vacations.admin.service";
import type { CreateVacationPayload } from "../services/vacations.admin.service";
import { useAuth } from "../contex/AuthContext";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import { useNavigate } from "react-router-dom";

export default function AdminVacationsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const userId = user?.userId ?? null;

    if (user?.role !== "admin") return <div>Not allowed</div>;

    const [rows, setRows] = useState<VacationRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editing, setEditing] = useState<VacationRow | null>(null);

    async function load() {
        setLoading(true);
        try {
            const resp = await fetchVacations({ filter: "admin", userId });
            setRows(resp?.data ?? []);
        } catch (err) {
            console.error("Load failed", err);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function openAdd() {
        setEditing(null);
        setModalMode("add");
        setModalOpen(true);
    }

    function openEdit(item: VacationRow) {
        setEditing(item);
        setModalMode("edit");
        setModalOpen(true);
    }

    async function handleSave(payload: CreateVacationPayload) {
        const normalizedPrice = typeof payload.price === "string" ? Number(payload.price) : payload.price;

        if (Number.isNaN(normalizedPrice)) {
            throw new Error("Invalid price value");
        }

        const finalPayload = {
            destination: payload.destination,
            description: payload.description,
            start_date: payload.start_date,
            end_date: payload.end_date,
            price: normalizedPrice,
            image: (payload as any).image,
        };

        if (modalMode === "add") {
            await createVacationAdmin(finalPayload);
        } else if (modalMode === "edit" && editing) {
            await updateVacationAdmin(editing.vacation_id, finalPayload);
        }

        await load();
    }

    async function handleDelete(id: number) {
        const ok = window.confirm("Are you sure you want to delete this vacation?");
        if (!ok) return;
        await deleteVacationAdmin(id);
        await load();
    }

    return (
        <section style={{ padding: 18 }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2>Admin - Vacations</h2>

                <div style={{ display: "flex", gap: 10 }}>
                    {" "}
                    <Button
                        style={{ fontSize: "12px" }}
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<EqualizerOutlinedIcon />}
                        onClick={() => navigate("/chart")}
                    >
                        Chart
                    </Button>
                    <Button
                        style={{ fontSize: "12px" }}
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<DownloadIcon />}
                        onClick={() => getCSV()}
                    >
                        CSV
                    </Button>
                    <Button
                        style={{ fontSize: "12px" }}
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<AddRoundedIcon />}
                        onClick={openAdd}
                    >
                        Add Vacation
                    </Button>
                </div>
            </header>

            <div style={{ display: "grid", gap: 12 }}>
                {rows.map((r) => (
                    <div key={r.vacation_id} style={{ position: "relative" }}>
                        <VacationCard
                            item={r}
                            onEdit={() => openEdit(r)}
                            onDelete={async () => {
                                await handleDelete(r.vacation_id);
                            }}
                        />
                    </div>
                ))}
            </div>

            <VacationFormModalMUI
                open={modalOpen}
                mode={modalMode}
                initial={
                    editing
                        ? {
                              destination: editing.destination,
                              description: editing.description,
                              start_date: editing.start_date?.slice(0, 10) ?? "",
                              end_date: editing.end_date?.slice(0, 10) ?? "",
                              price: editing.price,
                              image_name: editing.image_name ?? null,
                          }
                        : null
                }
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
        </section>
    );
}
