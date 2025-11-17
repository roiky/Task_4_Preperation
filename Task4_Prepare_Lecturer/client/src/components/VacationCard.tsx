import { Button } from "@mui/material";
import React from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

export type VacationRow = {
    vacation_id: number;
    destination: string;
    description: string;
    start_date: string;
    end_date: string;
    price: number;
    image_name?: string | null;
    followers_count: number;
    is_following: 0 | 1;
};

type Props = {
    item: VacationRow;
    loading?: boolean;
    onToggleFollow?: (vacationId: number, currentlyFollowing: boolean) => Promise<void>;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

const BASE_URL = "http://localhost:3000";

export default function VacationCard({ item, loading = false, onToggleFollow, onEdit, onDelete }: Props) {
    const start = formatDate(item.start_date);
    const end = formatDate(item.end_date);

    return (
        <article style={styles.card}>
            <div style={styles.media}>
                {item.image_name ? (
                    <img src={`${BASE_URL}/uploads/${item.image_name}`} alt={item.destination} style={styles.image} />
                ) : (
                    <div style={styles.noImage}>No image</div>
                )}
            </div>

            <div style={styles.body}>
                <h3 style={styles.title}>{item.destination}</h3>
                <p style={styles.desc}>{item.description}</p>

                <div style={styles.metaRow}>
                    <div style={styles.dates}>
                        <div>
                            <strong>Start:</strong> {start}
                        </div>
                        <div>
                            <strong>End:</strong> {end}
                        </div>
                    </div>

                    <div style={styles.price}>${formatPrice(item.price)}</div>
                </div>

                <div>
                    <div style={styles.followersCount}>{item.followers_count} followers</div>
                </div>

                <div style={styles.actionsRow}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {onToggleFollow ? (
                            <Button
                                style={{ fontSize: "12px" }}
                                size="small"
                                variant="outlined"
                                color={item.is_following ? "error" : "info"}
                                disabled={loading}
                                onClick={() => onToggleFollow(item.vacation_id, !!item.is_following)}
                            >
                                {/* {loading ? "…" : item.is_following ? "Unfollow" : "Follow"} */}
                                {item.is_following ? <ThumbDownOutlinedIcon /> : <ThumbUpOutlinedIcon />}
                            </Button>
                        ) : null}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        {onEdit && (
                            <Button
                                style={{ fontSize: "12px" }}
                                startIcon={<ModeEditOutlinedIcon />}
                                size="small"
                                variant="outlined"
                                //color={"error"}
                                onClick={() => onEdit(item.vacation_id)}
                            >
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                style={{ fontSize: "12px" }}
                                startIcon={<DeleteOutlinedIcon />}
                                size="small"
                                variant="outlined"
                                color={"error"}
                                onClick={() => onDelete(item.vacation_id)}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

/* small inline styles so you can copy quickly */
const styles: Record<string, React.CSSProperties> = {
    card: {
        display: "flex",
        gap: 12,
        border: "1px solid #e3e6ea",
        borderRadius: 10,
        padding: 12,
        background: "#fff",
        color: "#111",
        alignItems: "stretch",
    },
    media: { width: 200, minWidth: 200, height: 160, overflow: "hidden", borderRadius: 8, background: "#f3f3f3" },
    image: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    noImage: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" },
    body: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
    title: { margin: 0, fontSize: 18 },
    desc: { margin: 0, color: "#444", fontSize: 13 },
    metaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
    dates: { fontSize: 12, color: "#333" },
    price: { fontWeight: 700, fontSize: 16 },
    actionsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
    btnFollow: { background: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" },
    btnFollowing: {
        background: "#e0e0e0",
        color: "#111",
        border: "none",
        padding: "8px 12px",
        borderRadius: 8,
        cursor: "pointer",
    },
    followersCount: { fontSize: 13, color: "#666" },
    btnGhost: { background: "transparent", border: "1px solid #ccc", padding: "6px 10px", borderRadius: 8, cursor: "pointer" },
    btnDanger: { background: "#ff4d4f", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer" },
};

function formatDate(d: string | Date) {
    const date = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(date.getTime())) return "-";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    //return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    return `${dd}/${mm}/${yyyy}`;
}

function formatPrice(value: string | number): string {
    const num = Number(value);
    if (Number.isNaN(num)) return "-";
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
