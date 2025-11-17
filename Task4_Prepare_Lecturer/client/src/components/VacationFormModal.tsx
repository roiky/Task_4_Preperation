import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, FormHelperText } from "@mui/material";
import { CreateVacationPayload } from "../services/vacations.admin.service";

type Props = {
    open: boolean;
    mode: "add" | "edit";
    initial?: {
        destination?: string;
        description?: string;
        start_date?: string;
        end_date?: string;
        price?: number;
        image_name?: string | null;
    } | null;
    onClose: () => void;
    onSave: (payload: CreateVacationPayload) => Promise<void>;
};

export default function VacationFormModalMUI({ open, mode, initial = null, onClose, onSave }: Props) {
    const [destination, setDestination] = useState(initial?.destination ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [startDate, setStartDate] = useState(initial?.start_date ?? "");
    const [endDate, setEndDate] = useState(initial?.end_date ?? "");
    const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "0.00");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setDestination(initial?.destination ?? "");
            setDescription(initial?.description ?? "");
            setStartDate(initial?.start_date ?? "");
            setEndDate(initial?.end_date ?? "");
            setPrice(initial?.price != null ? String(initial.price) : "0.00");
            setImageFile(null);
            setErrors({});
        }
    }, [open, initial]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        setImageFile(f);
    }

    function validate(): boolean {
        const err: Record<string, string> = {};
        if (!destination.trim()) err.destination = "Destination is required";
        if (!description.trim() || description.trim().length < 10) err.description = "Description lenght must be at least 10 ";
        if (!startDate) err.start_date = "Start date is required";
        if (!endDate) err.end_date = "End date is required";

        const p = Number(price);
        if (Number.isNaN(p)) err.price = "Invalid price";
        else if (p < 0 || p > 10000) err.price = "Price must be between 0 and 10,000";

        if (startDate && endDate) {
            const s = new Date(startDate);
            const e = new Date(endDate);
            if (e.getTime() < s.getTime()) err.end_date = "End date must be equal or after start date";
        }

        if (mode === "add" && startDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const s = new Date(startDate);
            if (s.getTime() < today.getTime()) err.start_date = "Start date cannot be in the past";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    }

    async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSave({
                destination: destination.trim(),
                description: description.trim(),
                start_date: startDate,
                end_date: endDate,
                price: Number(price),
                image: imageFile ?? undefined,
            });
            onClose();
        } catch (err: any) {
            setErrors((s) => ({ ...s, form: err?.message ?? "Save failed" }));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{mode === "add" ? "Create Vacation" : "Edit Vacation"}</DialogTitle>

            <DialogContent dividers>
                {errors.form && <FormHelperText error>{errors.form}</FormHelperText>}
                <form id="vacation-form" onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <TextField
                            label="Destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            fullWidth
                            error={!!errors.destination}
                            helperText={errors.destination}
                            required
                        />

                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            minRows={3}
                            error={!!errors.description}
                            helperText={errors.description}
                            required
                        />

                        <TextField
                            label="Start date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            error={!!errors.start_date}
                            helperText={errors.start_date}
                            required
                        />

                        <TextField
                            label="End date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            error={!!errors.end_date}
                            helperText={errors.end_date}
                            required
                        />

                        <TextField
                            label="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            fullWidth
                            error={!!errors.price}
                            helperText={errors.price}
                            required
                        />

                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {initial?.image_name && !imageFile ? (
                            <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>Current: {initial.image_name}</div>
                        ) : null}
                    </Grid>
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" form="vacation-form" variant="contained" onClick={() => {}} disabled={submitting}>
                    {submitting ? "Saving…" : mode === "add" ? "Create" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
