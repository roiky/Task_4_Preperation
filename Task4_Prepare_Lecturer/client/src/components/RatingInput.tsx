import React from "react";

type Props = {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
};

export default function RatingInput({ label, value, onChange, min = 0, max = 10 }: Props) {
    return (
        <div className="field">
            <label>{label}</label>
            <input type="number" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        </div>
    );
}
