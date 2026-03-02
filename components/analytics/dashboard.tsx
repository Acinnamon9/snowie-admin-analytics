"use client";

import { useState, useMemo } from "react";
import { Card } from "@tremor/react";
import { AnalyticsTimeframe, AgentType, DailyAnalytics } from "@/types/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { KpiCards } from "./kpi-cards";
import { UsageChart } from "./usage-chart";
import { AgencyTable } from "./agency-table";
import { DistributionChart } from "./distribution-chart";
import { Insights } from "./insights";
import { Loader2 } from "lucide-react";
import { AnalyticsHeader } from "./header";
import { AgentBreakdown } from "./agent-breakdown";
import { DurationRange, matchesDuration } from "@/components/ui/duration-filter";

export function AnalyticsDashboard() {
    const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>("daily");
    const [metric, setMetric] = useState<"credits" | "calls">("credits");

    // Agent filter: multi-select with "all" being a special toggle
    const [activeAgents, setActiveAgents] = useState<Set<AgentType | "all">>(new Set(["all"]));

    // Date range filter
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    // Duration filter
    const [durationRange, setDurationRange] = useState<DurationRange>("all");

    const { data: rawData, isLoading, isError, error } = useAnalytics(timeframe);

    const handleAgentToggle = (agent: AgentType | "all") => {
        setActiveAgents(prev => {
            const next = new Set(prev);
            if (agent === "all") {
                // Toggle all: if "all" is active, keep it. If not, set to all.
                return new Set(["all"]);
            }

            // Remove "all" when selecting specific agents
            next.delete("all");

            if (next.has(agent)) {
                next.delete(agent);
                // If none selected, revert to "all"
                if (next.size === 0) return new Set(["all"]);
            } else {
                next.add(agent);
                // If all 4 are selected, switch to "all"
                if (next.size === 4) return new Set(["all"]);
            }
            return next;
        });
    };

    const handleDateChange = (start: string | null, end: string | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const data = useMemo(() => {
        if (!rawData) return null;

        let filtered = [...rawData];

        // Agent filter
        if (!activeAgents.has("all")) {
            filtered = filtered.filter(item =>
                activeAgents.has(item.agent_type)
            );
        }

        // Date filter (only applies to daily data which has a date field)
        if (startDate || endDate) {
            filtered = filtered.filter(item => {
                const dateItem = item as DailyAnalytics;
                if (!dateItem.date) return true; // non-daily data passes through
                const d = dateItem.date;
                if (startDate && d < startDate) return false;
                if (endDate && d > endDate) return false;
                return true;
            });
        }

        // Duration filter
        if (durationRange !== "all") {
            filtered = filtered.filter(item =>
                matchesDuration(item.total_duration, durationRange)
            );
        }

        return filtered as any;
    }, [rawData, activeAgents, startDate, endDate, durationRange]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in">
            <AnalyticsHeader
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                metric={metric}
                onMetricChange={setMetric}
                activeAgents={activeAgents}
                onAgentToggle={handleAgentToggle}
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                durationRange={durationRange}
                onDurationChange={setDurationRange}
            />

            {isLoading && (
                <div className="flex flex-col items-center justify-center p-32 gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl gradient-coral flex items-center justify-center shadow-lg shadow-[hsl(var(--coral)/0.3)] animate-pulse">
                            <Loader2 className="h-7 w-7 animate-spin text-white" />
                        </div>
                    </div>
                    <p className="text-muted-foreground font-medium text-sm animate-pulse">
                        Syncing data streams...
                    </p>
                </div>
            )}

            {isError && (
                <Card className="bg-destructive/5 border-destructive/20 p-8 text-center animate-in">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 rounded-full bg-destructive animate-ping" />
                    </div>
                    <h3 className="text-xl font-bold text-destructive mb-2">Sync Error</h3>
                    <p className="text-destructive/80 text-sm">{(error as Error).message}</p>
                </Card>
            )}

            {data && (
                <main className="grid grid-cols-1 gap-8 animate-in-delayed">
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
                        <AgentBreakdown data={data} />
                        <AgencyTable data={data} />
                        <Insights data={data} />
                    </div>
                </main>
            )}
        </div>
    );
}
