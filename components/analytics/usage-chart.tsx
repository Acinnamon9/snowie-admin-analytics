"use client";

import { Card, AreaChart, Legend } from "@tremor/react";
import { AnalyticsResponse, DailyAnalytics } from "@/types/analytics";

interface UsageChartProps {
    data: AnalyticsResponse;
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "Gemini": "orange",
    "Grok": "cyan",
    "UltraVox": "amber",
    "Text Agent": "emerald",
};

export function UsageChart({ data, metric }: UsageChartProps) {
    const labelDescription = metric === "credits" ? "Credits Consumed" : "Call Volume";

    const getAgentLabel = (name: string) => {
        if (name === "GeminiVoice") return "Gemini";
        if (name === "GrokRealtime") return "Grok";
        if (name === "UltraVoxVoice") return "UltraVox";
        if (name === "TextAgent") return "Text Agent";
        return name;
    };

    const groupMap = new Map<string, Record<string, number | string>>();
    const agents = new Set<string>();

    data.forEach(item => {
        const dateLabel = (item as DailyAnalytics).date
            ? new Date((item as DailyAnalytics).date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : `Agency ${item.agency_id.toString().slice(-4)}`;

        if (!groupMap.has(dateLabel)) {
            groupMap.set(dateLabel, { label: dateLabel });
        }

        const entry = groupMap.get(dateLabel)!;
        const agentDisplayName = getAgentLabel(item.agent_type);
        const val = metric === "credits" ? Number(item.total_credits.toFixed(2)) : item.total_calls;

        entry[agentDisplayName] = (Number(entry[agentDisplayName]) || 0) + val;
        agents.add(agentDisplayName);
    });

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
        <Card className="h-full p-6">
            {/* Safelist - split into separate elements to avoid property overlap warnings */}
            <div className="hidden" aria-hidden="true">
                <div className="bg-orange-500" /><div className="bg-cyan-500" /><div className="bg-amber-500" /><div className="bg-emerald-500" />
                <div className="text-orange-500" /><div className="text-cyan-500" /><div className="text-amber-500" /><div className="text-emerald-500" />
                <div className="fill-orange-500" /><div className="fill-cyan-500" /><div className="fill-amber-500" /><div className="fill-emerald-500" />
                <div className="stroke-orange-500" /><div className="stroke-cyan-500" /><div className="stroke-amber-500" /><div className="stroke-emerald-500" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-[17px] font-bold text-foreground tracking-tight">Usage Trends</h3>
                    <p className="text-[12px] font-medium text-muted-foreground mt-1">
                        {labelDescription}
                    </p>
                </div>
                <Legend
                    categories={categories}
                    colors={colors}
                    className="text-[12px]! font-semibold"
                />
            </div>

            <AreaChart
                className="h-80"
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
                animationDuration={1200}
            />
        </Card>
    );
}
