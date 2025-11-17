import api from "./api";

export type FetchArgs = { page?: number; pageSize?: number; filter?: string; userId?: number | null };

export async function fetchVacations({ filter = "all", userId = null, page = 1 }: FetchArgs) {
    const { data } = await api.get(`/vac/${filter}`, { params: { filter, userId, page } });
    return data;
}

export async function fetchFollowedVacationIds(): Promise<number[]> {
    const { data } = await api.get("/vac/followed");
    const rows = data?.data ?? [];
    return rows.map((r: any) => Number(r.vacation_id));
}

export async function followVacation(userId: number, vacationId: number) {
    await api.post(`/vac/${vacationId}/follow`, { userId });
}

export async function unfollowVacation(userId: number, vacationId: number) {
    await api.delete(`/vac/${vacationId}/follow`, { data: { userId } });
}
