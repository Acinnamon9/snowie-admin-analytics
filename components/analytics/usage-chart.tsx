"use client";

import { Card, Title, AreaChart, Text, Legend } from "@tremor/react";
import { DailyAnalytics, AgentType } from "@/types/analytics";

interface UsageChartProps {
    data: any[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "Gemini": "indigo",
    "Grok": "rose",
    "UltraVox": "amber",
    "Text Agent": "emerald",
};

export function UsageChart({ data, metric }: UsageChartProps) {
    const valueKey = metric === "credits" ? "total_credits" : "total_calls";
    const labelDescription = metric === "credits" ? "Credits Consumed" : "Call Volume";

    // Map internal names to display names
    const getAgentLabel = (name: string) => {
        if (name === "GeminiVoice") return "Gemini";
        if (name === "GrokRealtime") return "Grok";
        if (name === "UltraVoxVoice") return "UltraVox";
        if (name === "TextAgent") return "Text Agent";
        return name;
    };

    // Group and aggregate data by label
    const groupMap = new Map<string, Record<string, any>>();
    const agents = new Set<string>();

    data.forEach(item => {
        const dateLabel = (item as DailyAnalytics).date
            ? new Date((item as DailyAnalytics).date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : `Agency ${item.agency_id.toString().slice(-4)}`;

        if (!groupMap.has(dateLabel)) {
            groupMap.set(dateLabel, { label: dateLabel });
        }

        const entry = groupMap.get(dateLabel)!;
        const agentDisplayName = getAgentLabel(item.agent_type);
        const val = metric === "credits" ? Number(item.total_credits.toFixed(2)) : item.total_calls;

        entry[agentDisplayName] = (entry[agentDisplayName] || 0) + val;
        agents.add(agentDisplayName);
    });

    // Calculate total usage per agent to sort the legend
    const agentTotals = new Map<string, number>();
    data.forEach(item => {
        const agentLabel = getAgentLabel(item.agent_type);
        const val = metric === "credits" ? item.total_credits : item.total_calls;
        agentTotals.set(agentLabel, (agentTotals.get(agentLabel) || 0) + val);
    });

    const categories = Array.from(agents).sort((a, b) => (agentTotals.get(b) || 0) - (agentTotals.get(a) || 0));

    const chartData = Array.from(groupMap.values()).map(point => {
        const fullPoint = { ...point };
        categories.forEach(agent => {
            if (fullPoint[agent] === undefined) fullPoint[agent] = 0;
        });
        return fullPoint;
    });

    const colors = categories.map(agent => AGENT_COLORS[agent] || "slate");

    return (
        <Card className="h-full !bg-card/30 backdrop-blur-xl border-white/10 shadow-lg p-6">
            {/* Tailwind 4 Safelist for Tremor AreaChart & Legend */}
            <div className="hidden">
                <div className="bg-indigo-500 bg-rose-500 bg-amber-500 bg-emerald-500" />
                <div className="text-indigo-500 text-rose-500 text-amber-500 text-emerald-500" />
                <div className="fill-indigo-500 fill-rose-500 fill-amber-500 fill-emerald-500" />
                <div className="stroke-indigo-500 stroke-rose-500 stroke-amber-500 stroke-emerald-500" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Usage Trends</h3>
                    <p className="text-xs font-medium text-muted-foreground/60 transition-colors">
                        {labelDescription}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Legend
                        categories={categories}
                        colors={colors}
                        className="!text-xs font-medium"
                    />
                </div>
            </div>

            <AreaChart
                className="h-80 -ml-4"
                data={chartData}
                index="label"
                categories={categories}
                colors={colors}
                valueFormatter={(number: number) =>
                    Intl.NumberFormat("us").format(number).toString()
                }
                showAnimation={true}
                curveType="monotone"
                stack={true}
                showLegend={false}
                showGridLines={false}
                showYAxis={true}
                showXAxis={true}
                yAxisWidth={48}
                startEndOnly={false}
                animationDuration={1500}
            />
        </Card>
    );
}
