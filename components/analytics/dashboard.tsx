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
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-card p-6 rounded-2xl border shadow-sm">
                <div className="space-y-1">
                    <Title className="text-3xl font-bold tracking-tight">Snowie Analytics</Title>
                    <Text className="text-muted-foreground">Monitor agency usage and credit consumption across models.</Text>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1.5">
                        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeframe</Text>
                        <TabGroup onIndexChange={handleTimeframeChange}>
                            <TabList variant="solid" className="bg-muted/50">
                                <Tab>Daily</Tab>
                                <Tab>Weekly</Tab>
                                <Tab>Monthly</Tab>
                            </TabList>
                        </TabGroup>
                    </div>

                    <div className="space-y-1.5">
                        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Metric View</Text>
                        <TabGroup onIndexChange={handleMetricChange}>
                            <TabList variant="solid" className="bg-muted/50">
                                <Tab>Credits</Tab>
                                <Tab>Calls</Tab>
                            </TabList>
                        </TabGroup>
                    </div>

                    <div className="space-y-1.5 min-w-[180px]">
                        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agent Model</Text>
                        <Select value={activeAgent} onValueChange={(v) => setActiveAgent(v as any)}>
                            <SelectItem value="all">All Agents</SelectItem>
                            <SelectItem value="GeminiVoice">Gemini Voice</SelectItem>
                            <SelectItem value="GrokRealtime">Grok Realtime</SelectItem>
                            <SelectItem value="UltraVoxVoice">UltraVox Voice</SelectItem>
                        </Select>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center p-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {isError && (
                <Card className="bg-destructive/10 border-destructive/20">
                    <Text className="text-destructive font-semibold">Error Loading Data</Text>
                    <Text>{(error as Error).message}</Text>
                </Card>
            )}

            {data && (
                <div className="grid grid-cols-1 gap-6">
                    <KpiCards data={data} metric={metric} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <UsageChart data={data} metric={metric} />
                        </div>
                        <div className="lg:col-span-1">
                            <DistributionChart data={data} metric={metric} />
                        </div>
                    </div>

                    <AgencyTable data={data} />
                    <Insights data={data} />
                </div>
            )}
        </div>
    );
}
