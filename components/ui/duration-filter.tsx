"use client";

import React from "react";
import { Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type DurationRange = "all" | "under1" | "1to5" | "5to15" | "over15";

interface DurationFilterProps {
    value: DurationRange;
    onChange: (range: DurationRange) => void;
    className?: string;
}

const RANGES: { key: DurationRange; label: string }[] = [
    { key: "all", label: "All" },
    { key: "under1", label: "<1m" },
    { key: "1to5", label: "1-5m" },
    { key: "5to15", label: "5-15m" },
    { key: "over15", label: "15m+" },
];

export function DurationFilter({ value, onChange, className }: DurationFilterProps) {
    return (
        <div className={cn("flex items-center gap-0.5 p-[3px] rounded-[12px] bg-secondary/80 border border-border/50", className)}>
            <div className="flex items-center px-2 text-[hsl(var(--teal))]">
                <Clock size={13} />
            </div>
            {RANGES.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={cn(
                        "px-3 py-[5px] rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-all duration-300",
                        value === key
                            ? "bg-[hsl(var(--teal))] text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                    style={value === key ? { boxShadow: "0 2px 8px -1px rgba(42, 168, 155, 0.35)" } : undefined}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export function matchesDuration(durationSeconds: number, range: DurationRange): boolean {
    const mins = durationSeconds / 60;
    switch (range) {
        case "all": return true;
        case "under1": return mins < 1;
        case "1to5": return mins >= 1 && mins < 5;
        case "5to15": return mins >= 5 && mins < 15;
        case "over15": return mins >= 15;
        default: return true;
    }
}
