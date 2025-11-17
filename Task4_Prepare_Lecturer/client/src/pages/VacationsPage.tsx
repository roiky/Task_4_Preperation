import React, { useEffect, useState } from "react";
import VacationCard, { VacationRow } from "../components/VacationCard";
import { fetchVacations, followVacation, unfollowVacation, fetchFollowedVacationIds } from "../services/vacations.service";
import { useAuth } from "../contex/AuthContext";

export default function VacationsPage() {
    const { user } = useAuth();
    const userId = user?.userId ?? null;

    const [rows, setRows] = useState<VacationRow[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<Record<number, boolean>>({});

    const [filter, setFilter] = useState<"all" | "upcoming" | "active" | "followed">("all");

    async function load() {
        setLoading(true);
        try {
            const resp = await fetchVacations({ filter, userId, page });
            const data = resp?.data ?? [];
            const meta = resp?.meta ?? { total: 0, page: page, pageSize };

            const metaTotal = Number(meta.total ?? 0);
            const metaPage = Number(meta.page ?? page);
            const metaPageSize = Number(meta.pageSize ?? pageSize);

            let followedIds = new Set<number>(); //to get all the vacations the user is following
            if (userId) {
                try {
                    const ids = await fetchFollowedVacationIds();
                    followedIds = new Set(ids);
                } catch (err) {
                    console.warn("Failed to fetch followed ids:", err);
                }
            }

            const synced = (data ?? []).map((r: any) => ({
                ...r,
                is_following: userId ? (followedIds.has(Number(r.vacation_id)) ? 1 : 0) : 0,
            }));

            setRows(synced);
            setTotal(metaTotal);
            setPage(metaPage);
            setPageSize(metaPageSize);
        } catch (err) {
            console.error("Failed to load vacations", err);
            setRows([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [page, filter, userId]);

    async function handleToggleFollow(vacationId: number, currentlyFollowing: boolean) {
        if (!userId) {
            alert("You must be logged in to follow vacations.");
            return;
        }

        setSaving((s) => ({ ...s, [vacationId]: true }));

        try {
            if (currentlyFollowing) {
                await unfollowVacation(userId, vacationId);
            } else {
                await followVacation(userId, vacationId);
            }

            await load();
        } catch (err) {
            console.error("Follow/unfollow failed:", err);
            alert("Action failed, please try again.");
        } finally {
            setSaving((s) => {
                const copy = { ...s };
                delete copy[vacationId];
                return copy;
            });
        }
    }

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;

    return (
        <section style={{ padding: 18 }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2>Vacations</h2>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                        value={filter}
                        onChange={(e) => {
                            setPage(1);
                            setFilter(e.target.value as any);
                        }}
                    >
                        <option value="all">All Vacations</option>
                        <option value="upcoming">Upcoming Vacations</option>
                        <option value="active">Active Vacations</option>
                        <option value="followed">Followed Vacations</option>
                    </select>
                </div>
                <div>{loading ? "Loading..." : `[${total} vacations]`}</div>
            </header>

            <div style={{ display: "grid", gap: 12 }}>
                {rows.map((r) => (
                    <VacationCard
                        key={r.vacation_id}
                        item={r}
                        loading={!!saving[r.vacation_id]}
                        onToggleFollow={handleToggleFollow}
                    />
                ))}
            </div>

            <div className="PagesPagination" style={{ textAlign: "center", marginTop: 10 }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={prevDisabled}>
                    Previous
                </button>

                <span style={{ margin: "10px" }}>
                    {page} / {totalPages}
                </span>

                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={nextDisabled}>
                    Next
                </button>
            </div>
        </section>
    );
}
