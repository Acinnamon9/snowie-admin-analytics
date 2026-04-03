"use client";

import { AnalyticsTimeframe, AgentType } from "@/types/analytics";
import { ThemeToggle } from "../theme-toggle";
import { SegmentedControl } from "../ui/segmented-control";
import { DateRangePicker } from "../ui/date-range-picker";
import { DurationFilter, DurationRange } from "../ui/duration-filter";
import { AgentFilter } from "../ui/agent-filter";
import { Activity, Sparkles } from "lucide-react";

interface AnalyticsHeaderProps {
    timeframe: AnalyticsTimeframe;
    onTimeframeChange: (timeframe: AnalyticsTimeframe) => void;
    metric: "credits" | "calls";
    onMetricChange: (metric: "credits" | "calls") => void;
    activeAgents: Set<AgentType | "all">;
    onAgentToggle: (agent: AgentType | "all") => void;
    startDate: string | null;
    endDate: string | null;
    onDateChange: (start: string | null, end: string | null) => void;
    durationRange: DurationRange;
    onDurationChange: (range: DurationRange) => void;
    excludedCount?: number;
    onClearExclusions?: () => void;
}

export function AnalyticsHeader({
    timeframe,
    onTimeframeChange,
    metric,
    onMetricChange,
    activeAgents,
    onAgentToggle,
    startDate,
    endDate,
    onDateChange,
    durationRange,
    onDurationChange,
    excludedCount = 0,
    onClearExclusions,
}: AnalyticsHeaderProps) {
    const handleTimeframeChange = (index: number) => {
        const timeframes: AnalyticsTimeframe[] = ["daily", "weekly", "monthly"];
        onTimeframeChange(timeframes[index]);
    };

    const handleMetricChange = (index: number) => {
        onMetricChange(index === 0 ? "credits" : "calls");
    };

    return (
        <header className="dash-card relative" style={{ overflow: "visible" }}>
            {/* Colored top strip */}
            <div className="h-1 w-full rounded-t-[1.25rem] bg-gradient-to-r from-[hsl(var(--coral))] via-[hsl(var(--amber))] to-[hsl(var(--teal))]" />

            {/* ─── Branding Bar ─── */}
            <div className="flex items-center justify-between px-7 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[14px] gradient-coral flex items-center justify-center shadow-lg" style={{ boxShadow: "0 6px 20px -4px rgba(232, 96, 60, 0.35)" }}>
                        <Activity size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-[22px] font-extrabold tracking-tight text-foreground flex items-center gap-2">
                            Snowie Analytics
                            <Sparkles size={14} className="text-[hsl(var(--amber))] animate-pulse-glow" />
                            {excludedCount > 0 && (
                                <div className="ml-2 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[hsl(var(--coral)/0.1)] border border-[hsl(var(--coral)/0.2)] animate-in fade-in zoom-in duration-300">
                                    <span className="text-[10px] font-bold text-[hsl(var(--coral))] uppercase tracking-wider">
                                        {excludedCount} Excluded
                                    </span>
                                    {onClearExclusions && (
                                        <button 
                                            onClick={onClearExclusions}
                                            className="text-[9px] font-black text-[hsl(var(--coral))] hover:underline underline-offset-2 transition-colors ml-1"
                                        >
                                            RESET
                                        </button>
                                    )}
                                </div>
                            )}
                        </h1>
                        <p className="text-[13px] font-medium text-muted-foreground tracking-wide mt-0.5">
                            Real-time agent performance & usage
                        </p>
                    </div>
                </div>
                <ThemeToggle />
            </div>

            {/* ─── Divider ─── */}
            <div className="h-px mx-7 bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* ─── Primary Controls ─── */}
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4 px-7 py-5 relative z-50">
                <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        Timeframe
                    </span>
                    <SegmentedControl
                        options={["Daily", "Weekly", "Monthly"]}
                        value={["daily", "weekly", "monthly"].indexOf(timeframe)}
                        onChange={handleTimeframeChange}
                        className="min-w-[220px]"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        Metric
                    </span>
                    <SegmentedControl
                        options={["Credits", "Calls"]}
                        value={metric === "credits" ? 0 : 1}
                        onChange={handleMetricChange}
                        className="min-w-[150px]"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        Date Range
                    </span>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={onDateChange}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        Call Duration
                    </span>
                    <DurationFilter
                        value={durationRange}
                        onChange={onDurationChange}
                    />
                </div>
            </div>

            {/* ─── Divider ─── */}
            <div className="h-px mx-7 bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* ─── Agent Filter ─── */}
            <div className="px-7 py-4 flex items-center gap-5">
                <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground shrink-0">
                    Agents
                </span>
                <AgentFilter
                    activeAgents={activeAgents}
                    onToggle={onAgentToggle}
                />
            </div>
        </header>
    );
}
