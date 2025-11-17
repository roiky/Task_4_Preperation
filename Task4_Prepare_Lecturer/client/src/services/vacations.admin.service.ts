import api from "./api";

export async function getCSV() {
    try {
        const resp = await api.get("/reports/csv", { responseType: "blob" });

        const blob = new Blob([resp.data], { type: "text/csv;charset=utf-8;" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        a.download = "followers_report.csv";

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (err: any) {
        console.error("Failed to download CSV:", err);
        alert("Failed to download CSV — check console for details.");
    }
}

export async function getFollowersJSON() {
    try {
        const resp = await api.get("/reports/followers");

        const rows = resp.data ?? [];
        return rows;
    } catch (err: any) {
        console.error("Failed to get followers JSON:", err);
    }
}

export type CreateVacationPayload = {
    destination: string;
    description: string;
    start_date: string;
    end_date: string;
    price: number | string;
    image?: File | null;
};

export async function createVacationAdmin(payload: CreateVacationPayload) {
    const fd = new FormData();
    fd.append("destination", payload.destination);
    fd.append("description", payload.description);
    fd.append("start_date", payload.start_date);
    fd.append("end_date", payload.end_date);
    fd.append("price", String(payload.price));
    if (payload.image) fd.append("image", payload.image);

    const { data } = await api.post("/admin/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function updateVacationAdmin(id: number, payload: CreateVacationPayload) {
    const fd = new FormData();
    fd.append("destination", payload.destination);
    fd.append("description", payload.description);
    fd.append("start_date", payload.start_date);
    fd.append("end_date", payload.end_date);
    fd.append("price", String(payload.price));
    if (payload.image) fd.append("image", payload.image);

    const { data } = await api.put(`/admin/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function deleteVacationAdmin(id: number) {
    const { data } = await api.delete(`/admin/${id}`);
    return data;
}
