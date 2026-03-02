"use client";

import { TabGroup, TabList, Tab } from "@tremor/react";
import { AnalyticsTimeframe, AgentType } from "@/types/analytics";
import { ThemeToggle } from "../theme-toggle";

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
        <header className="flex flex-col lg:flex-row lg:items-center gap-8 glass-card p-8 rounded-3xl border-white/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative z-10 flex flex-wrap items-center gap-6">
                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1 flex items-center gap-2 group/label">
                        <div className="w-1 h-1 rounded-full bg-primary/40 group-hover/label:bg-primary transition-colors" />
                        Timeframe
                    </span>
                    <TabGroup
                        index={["daily", "weekly", "monthly"].indexOf(timeframe)}
                        onIndexChange={handleTimeframeChange}
                    >
                        <TabList variant="solid" className="glass-card !bg-muted/30 border-none">
                            <Tab className="px-4 py-1.5 font-semibold text-xs">Daily</Tab>
                            <Tab className="px-4 py-1.5 font-semibold text-xs">Weekly</Tab>
                            <Tab className="px-4 py-1.5 font-semibold text-xs">Monthly</Tab>
                        </TabList>
                    </TabGroup>
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1 flex items-center gap-2 group/label">
                        <div className="w-1 h-1 rounded-full bg-primary/40 group-hover/label:bg-primary transition-colors" />
                        Metric
                    </span>
                    <TabGroup
                        index={metric === "credits" ? 0 : 1}
                        onIndexChange={handleMetricChange}
                    >
                        <TabList variant="solid" className="glass-card !bg-muted/30 border-none">
                            <Tab className="px-4 py-1.5 font-semibold text-xs">Credits</Tab>
                            <Tab className="px-4 py-1.5 font-semibold text-xs">Calls</Tab>
                        </TabList>
                    </TabGroup>
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1 flex items-center gap-2 group/label">
                        <div className="w-1 h-1 rounded-full bg-primary/40 group-hover/label:bg-primary transition-colors" />
                        Model Engine
                    </span>
                    <TabGroup
                        index={activeAgentIndex}
                        onIndexChange={(idx) => onAgentChange(agents[idx])}
                    >
                        <TabList variant="solid" className="glass-card !bg-muted/30 border-none">
                            <Tab className="px-3 py-1.5 font-semibold text-xs whitespace-nowrap">All</Tab>
                            <Tab className="px-3 py-1.5 font-semibold text-xs whitespace-nowrap">Gemini</Tab>
                            <Tab className="px-3 py-1.5 font-semibold text-xs whitespace-nowrap">Grok</Tab>
                            <Tab className="px-3 py-1.5 font-semibold text-xs whitespace-nowrap">UltraVox</Tab>
                            <Tab className="px-3 py-1.5 font-semibold text-xs whitespace-nowrap">Text</Tab>
                        </TabList>
                    </TabGroup>
                </div>

                <div className="lg:ml-auto flex items-center justify-end">
                    <div className="p-1 glass-card rounded-xl !bg-muted/30 border-none group/toggle">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
