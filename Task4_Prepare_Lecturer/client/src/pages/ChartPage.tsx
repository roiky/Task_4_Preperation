import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { getFollowersJSON } from "../services/vacations.admin.service";

type ReportRow = { vacation_id: number; destination: string; followers_count: number };

export default function FollowersChartSimple() {
    const [labels, setLabels] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const resp = await getFollowersJSON();
                const data: ReportRow[] = resp?.data ?? [];
                setLabels(data.map((r) => r.destination));
                setValues(data.map((r) => Number(r.followers_count ?? 0)));
            } catch (err) {
                console.log("Failed to load followers JSON:", err);
                setLabels([]);
                setValues([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Loading chart…</div>;

    return (
        <div style={{ width: "100%", maxWidth: 900 }}>
            <h3 style={{ marginTop: 0 }}>Followers per Vacation</h3>

            <BarChart
                xAxis={[
                    {
                        id: "vacations",
                        data: labels,
                    },
                ]}
                series={[
                    {
                        id: "followers",
                        data: values,
                        label: "Followers",
                    },
                ]}
                height={320}
            />
        </div>
    );
}
