"use client";

import { Card, Title, AreaChart, Text, Legend } from "@tremor/react";
import { DailyAnalytics, AgentType } from "@/types/analytics";

interface UsageChartProps {
    data: any[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "Gemini": "blue",
    "Grok": "violet",
    "UltraVox": "orange",
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

    const categories = Array.from(agents);
    const chartData = Array.from(groupMap.values()).map(point => {
        const fullPoint = { ...point };
        categories.forEach(agent => {
            if (fullPoint[agent] === undefined) fullPoint[agent] = 0;
        });
        return fullPoint;
    });

    const colors = categories.map(agent => AGENT_COLORS[agent] || "slate");

    return (
        <Card className="h-full !bg-card/30 backdrop-blur-xl border-white/10 premium-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Usage Trends
                    </h3>
                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mt-1">
                        {labelDescription}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Legend
                        categories={categories}
                        colors={colors}
                        className="!text-[10px] font-bold uppercase tracking-wider"
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
