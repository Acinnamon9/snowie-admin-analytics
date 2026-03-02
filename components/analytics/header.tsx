"use client";

import { AnalyticsTimeframe, AgentType } from "@/types/analytics";
import { ThemeToggle } from "../theme-toggle";
import { SegmentedControl } from "../ui/segmented-control";

interface AnalyticsHeaderProps {
    timeframe: AnalyticsTimeframe;
    onTimeframeChange: (timeframe: AnalyticsTimeframe) => void;
    metric: "credits" | "calls";
    onMetricChange: (metric: "credits" | "calls") => void;
    activeAgent: AgentType | "all";
    onAgentChange: (agent: AgentType | "all") => void;
}

export function AnalyticsHeader({
    timeframe,
    onTimeframeChange,
    metric,
    onMetricChange,
    activeAgent,
    onAgentChange
}: AnalyticsHeaderProps) {
    const handleTimeframeChange = (index: number) => {
        const timeframes: AnalyticsTimeframe[] = ["daily", "weekly", "monthly"];
        onTimeframeChange(timeframes[index]);
    };

    const handleMetricChange = (index: number) => {
        onMetricChange(index === 0 ? "credits" : "calls");
    };

    const agents: (AgentType | "all")[] = ["all", "GeminiVoice", "GrokRealtime", "UltraVoxVoice", "TextAgent"];
    const activeAgentIndex = activeAgent === "all" ? 0 : agents.indexOf(activeAgent);

    return (
        <header className="flex flex-col gap-6 p-6 !bg-card/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Snowie Analytics
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground/60">
                        Agent performance and usage insights
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                </div>
            </div>

            <div className="h-px w-full bg-border/50 relative z-10" />

            <div className="relative z-10 flex flex-wrap items-center gap-x-8 gap-y-6">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                        Timeframe
                    </span>
                    <SegmentedControl
                        options={["Daily", "Weekly", "Monthly"]}
                        value={["daily", "weekly", "monthly"].indexOf(timeframe)}
                        onChange={handleTimeframeChange}
                        className="min-w-[240px]"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                        Visualizing
                    </span>
                    <SegmentedControl
                        options={["Credits", "Calls"]}
                        value={metric === "credits" ? 0 : 1}
                        onChange={handleMetricChange}
                        className="min-w-[160px]"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                        Engine Filter
                    </span>
                    <SegmentedControl
                        options={["All", "Gemini", "Grok", "UltraVox", "Text"]}
                        value={activeAgentIndex}
                        onChange={(idx) => onAgentChange(agents[idx])}
                        className="min-w-[320px]"
                    />
                </div>
            </div>
        </header>
    );
}
