"use client";

import { useState, useMemo } from "react";
import { Text, Card } from "@tremor/react";
import { AnalyticsTimeframe, AgentType } from "@/types/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { KpiCards } from "./kpi-cards";
import { UsageChart } from "./usage-chart";
import { AgencyTable } from "./agency-table";
import { DistributionChart } from "./distribution-chart";
import { Insights } from "./insights";
import { Loader2 } from "lucide-react";
import { AnalyticsHeader } from "./header";

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

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in">
            <AnalyticsHeader
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                metric={metric}
                onMetricChange={setMetric}
                activeAgent={activeAgent}
                onAgentChange={setActiveAgent}
            />

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
