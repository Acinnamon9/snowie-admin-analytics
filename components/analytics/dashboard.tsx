"use client";

import { useState, useMemo } from "react";
import { Title, Text, TabGroup, TabList, Tab, Card, Select, SelectItem, Badge, Flex, TabGroup as MetricTabGroup } from "@tremor/react";
import { AnalyticsTimeframe, AgentType } from "@/types/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { KpiCards } from "./kpi-cards";
import { UsageChart } from "./usage-chart";
import { AgencyTable } from "./agency-table";
import { DistributionChart } from "./distribution-chart";
import { Insights } from "./insights";
import { Loader2 } from "lucide-react";

export function AnalyticsDashboard() {
    const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>("daily");
    const [activeAgent, setActiveAgent] = useState<AgentType | "all">("all");
    const [metric, setMetric] = useState<"credits" | "calls">("credits");

    const { data: rawData, isLoading, isError, error } = useAnalytics(timeframe);

    const data = useMemo(() => {
        if (!rawData) return null;
        if (activeAgent === "all") return rawData;
        return rawData.filter((item) => item.agent_type === activeAgent) as any;
    }, [rawData, activeAgent]);

    const handleTimeframeChange = (index: number) => {
        const timeframes: AnalyticsTimeframe[] = ["daily", "weekly", "monthly"];
        setTimeframe(timeframes[index]);
    };

    const handleMetricChange = (index: number) => {
        setMetric(index === 0 ? "credits" : "calls");
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 glass-card p-8 rounded-3xl border-white/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <div className="w-5 h-5 rounded-full bg-primary animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Snowie Intelligence
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg font-medium max-w-md">
                        Advanced agency analytics & model performance tracking.
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1">
                            Timeframe
                        </span>
                        <TabGroup onIndexChange={handleTimeframeChange}>
                            <TabList variant="solid" className="glass-card !bg-muted/30 border-none">
                                <Tab className="px-4 py-1.5 font-semibold text-sm">Daily</Tab>
                                <Tab className="px-4 py-1.5 font-semibold text-sm">Weekly</Tab>
                                <Tab className="px-4 py-1.5 font-semibold text-sm">Monthly</Tab>
                            </TabList>
                        </TabGroup>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1">
                            Metric
                        </span>
                        <TabGroup onIndexChange={handleMetricChange}>
                            <TabList variant="solid" className="glass-card !bg-muted/30 border-none">
                                <Tab className="px-4 py-1.5 font-semibold text-sm">Credits</Tab>
                                <Tab className="px-4 py-1.5 font-semibold text-sm">Calls</Tab>
                            </TabList>
                        </TabGroup>
                    </div>

                    <div className="space-y-2 min-w-[200px]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1">
                            Agent Model
                        </span>
                        <Select value={activeAgent} onValueChange={(v) => setActiveAgent(v as any)}>
                            <SelectItem value="all">All Agents</SelectItem>
                            <SelectItem value="GeminiVoice">Gemini Voice</SelectItem>
                            <SelectItem value="GrokRealtime">Grok Realtime</SelectItem>
                            <SelectItem value="UltraVoxVoice">UltraVox Voice</SelectItem>
                        </Select>
                    </div>
                </div>
            </header>

            {isLoading && (
                <div className="flex flex-col items-center justify-center p-32 gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground font-medium animate-pulse">Syncing data streams...</p>
                </div>
            )}

            {isError && (
                <Card className="bg-destructive/5 border-destructive/20 p-8 text-center animate-in">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 rounded-full bg-destructive animate-ping" />
                    </div>
                    <h3 className="text-xl font-bold text-destructive mb-2">Sync Error</h3>
                    <Text className="text-destructive/80">{(error as Error).message}</Text>
                </Card>
            )}

            {data && (
                <main className="grid grid-cols-1 gap-8 animate-in">
                    <KpiCards data={data} metric={metric} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 group">
                            <UsageChart data={data} metric={metric} />
                        </div>
                        <div className="lg:col-span-1">
                            <DistributionChart data={data} metric={metric} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <AgencyTable data={data} />
                        <Insights data={data} />
                    </div>
                </main>
            )}
        </div>
    );
}
