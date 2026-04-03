"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { Card } from "@tremor/react";
import { AnalyticsTimeframe, AgentType, DailyAnalytics, BaseAnalytics } from "@/types/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAgencyNames } from "@/hooks/use-agency-names";
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

    // Agency exclusion filter
    const [excludedAgencies, setExcludedAgencies] = useState<Set<number>>(new Set());


    const { data: rawData, isLoading: isDataLoading, isError, error } = useAnalytics(timeframe);
    const { data: agencyNames, isLoading: isNamesLoading } = useAgencyNames();

    const isLoading = isDataLoading || (isNamesLoading && timeframe === "daily");

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
                // If all are selected, switch to "all" (Gemini, Grok, UltraVox, Avatar, Text)
                if (next.size === 5) return new Set(["all"]);
            }
            return next;
        });
    };

    const handleDateChange = (start: string | null, end: string | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleToggleExclude = (id: number) => {
        setExcludedAgencies(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleClearExclusions = () => {
        setExcludedAgencies(new Set());
    };

    // 1. Enrich data with agency names (only re-runs when raw data or names change)
    const enrichedData = useMemo(() => {
        if (!rawData) return null;

        return rawData.map(item => {
            if (item.agency__company_name) return item;

            const metadata = agencyNames?.get(item.agency_id);
            if (metadata) {
                return {
                    ...item,
                    agency__company_name: metadata.name,
                    agency__schema_name: metadata.uuid,
                };
            }
            return item;
        });
    }, [rawData, agencyNames]);

    // 2. Apply global filters (Engine, Date, Duration)
    const baseFilteredData = useMemo(() => {
        if (!enrichedData) return null;

        let filtered = [...enrichedData];

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

        return filtered as BaseAnalytics[];
    }, [enrichedData, activeAgents, startDate, endDate, durationRange]);

    // 3. Final analytics (handles exclusions and prepares the object for consumers)
    const analytics = useMemo(() => {
        if (!baseFilteredData) return null;

        const final = baseFilteredData.filter(item => !excludedAgencies.has(item.agency_id));

        return { baseData: baseFilteredData, data: final };
    }, [baseFilteredData, excludedAgencies]);

    // DEFERRED ANALYTICS: This allows charts to render in the background while 
    // lightweight components like KPIs and Tables update the moment an agency is hidden.
    const deferredAnalyticsData = useDeferredValue(analytics?.data || []);


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
                excludedCount={excludedAgencies.size}
                onClearExclusions={handleClearExclusions}
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

            {analytics && (
                <main className="grid grid-cols-1 gap-8 animate-in-delayed">
                    {/* High Priority (Instant Updates) */}
                    <KpiCards data={analytics.data} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 group">
                            {/* Low Priority (Background Processing) */}
                            <UsageChart data={deferredAnalyticsData} metric={metric} />
                        </div>
                        <div className="lg:col-span-1">
                            {/* Low Priority (Background Processing) */}
                            <DistributionChart data={deferredAnalyticsData} metric={metric} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* High Priority (Instant Updates) */}
                        <AgentBreakdown data={analytics.data} />
                        
                        <AgencyTable 
                            data={analytics.baseData} 
                            excludedAgencies={excludedAgencies}
                            onToggleExclude={handleToggleExclude}
                        />

                        {/* Low Priority (Background Processing) */}
                        <Insights data={deferredAnalyticsData || []} />
                    </div>
                </main>
            )}
        </div>
    );
}
