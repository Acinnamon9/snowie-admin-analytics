"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface DateRangePickerProps {
    startDate: string | null;
    endDate: string | null;
    onDateChange: (start: string | null, end: string | null) => void;
    className?: string;
}

type Preset = { label: string; getValue: () => [string, string] };

export function DateRangePicker({ startDate, endDate, onDateChange, className }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activePreset, setActivePreset] = useState<string>("all");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];

    const presets: Preset[] = [
        { label: "Today", getValue: () => [fmt(today), fmt(today)] },
        {
            label: "Last 7 days",
            getValue: () => { const d = new Date(today); d.setDate(d.getDate() - 7); return [fmt(d), fmt(today)]; },
        },
        {
            label: "Last 30 days",
            getValue: () => { const d = new Date(today); d.setDate(d.getDate() - 30); return [fmt(d), fmt(today)]; },
        },
        {
            label: "This Month",
            getValue: () => { const d = new Date(today.getFullYear(), today.getMonth(), 1); return [fmt(d), fmt(today)]; },
        },
    ];

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePreset = (preset: Preset) => {
        const [s, e] = preset.getValue();
        setActivePreset(preset.label);
        onDateChange(s, e);
        setIsOpen(false);
    };

    const handleClear = () => {
        setActivePreset("all");
        onDateChange(null, null);
        setIsOpen(false);
    };

    const displayLabel = activePreset === "all"
        ? "All Dates"
        : activePreset === "custom"
            ? `${startDate} → ${endDate}`
            : activePreset;

    return (
        <div className={`relative ${className || ""}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 px-4 py-[9px] rounded-[12px] bg-secondary/80 border border-border/50 hover:border-[hsl(var(--coral)/0.3)] transition-all duration-300 text-[13px] font-semibold text-foreground min-w-[180px] group"
            >
                <Calendar size={14} className="text-[hsl(var(--coral))] shrink-0" />
                <span className="truncate flex-1 text-left">{displayLabel}</span>
                <ChevronDown size={13} className={`text-muted-foreground/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 z-[100] w-80 rounded-2xl p-5 animate-in overflow-hidden" style={{
                    background: "hsl(var(--card-surface))",
                    border: "2px solid hsl(var(--border))",
                    boxShadow: "0 20px 60px -10px rgba(0,0,0,0.3), 0 8px 20px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                    backdropFilter: "blur(20px)",
                }}>
                    {/* Quick Presets */}
                    <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2 block">
                            Quick Select
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                onClick={handleClear}
                                className={`px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all duration-200 ${activePreset === "all"
                                    ? "bg-[hsl(var(--coral))] text-white shadow-md"
                                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                                style={activePreset === "all" ? { boxShadow: "0 3px 10px -2px rgba(232, 96, 60, 0.35)" } : undefined}
                            >
                                All Time
                            </button>
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePreset(preset)}
                                    className={`px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all duration-200 ${activePreset === preset.label
                                        ? "bg-[hsl(var(--coral))] text-white shadow-md"
                                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        }`}
                                    style={activePreset === preset.label ? { boxShadow: "0 3px 10px -2px rgba(232, 96, 60, 0.35)" } : undefined}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Range */}
                    <div className="border-t border-border/40 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3 block">
                            Custom Range
                        </span>
                        <div className="flex flex-col gap-2">
                            <input
                                type="date"
                                value={startDate || ""}
                                onChange={(e) => {
                                    setActivePreset("custom");
                                    onDateChange(e.target.value || null, endDate);
                                }}
                                className="w-full px-3 py-2.5 rounded-[10px] bg-secondary border border-border text-[13px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--coral)/0.3)] focus:border-[hsl(var(--coral)/0.4)] transition-all"
                            />
                            <div className="flex items-center gap-2 px-2">
                                <div className="flex-1 h-px bg-border/40" />
                                <span className="text-muted-foreground/50 text-[10px] font-bold uppercase">to</span>
                                <div className="flex-1 h-px bg-border/40" />
                            </div>
                            <input
                                type="date"
                                value={endDate || ""}
                                onChange={(e) => {
                                    setActivePreset("custom");
                                    onDateChange(startDate, e.target.value || null);
                                }}
                                className="w-full px-3 py-2.5 rounded-[10px] bg-secondary border border-border text-[13px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--coral)/0.3)] focus:border-[hsl(var(--coral)/0.4)] transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
