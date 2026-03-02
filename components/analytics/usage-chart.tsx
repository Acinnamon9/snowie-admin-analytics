"use client";

import { Card, Title, AreaChart, Text, Legend } from "@tremor/react";
import { DailyAnalytics, AgentType } from "@/types/analytics";

interface UsageChartProps {
    data: any[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "GeminiVoice": "blue",
    "GrokRealtime": "violet",
    "UltraVoxVoice": "orange",
    "TextAgent": "emerald",
};

const AGENT_LABELS: Record<string, string> = {
    "GeminiVoice": "Gemini",
    "GrokRealtime": "Grok",
    "UltraVoxVoice": "UltraVox",
    "TextAgent": "Text Agent",
};

export function UsageChart({ data, metric }: UsageChartProps) {
    const valueKey = metric === "credits" ? "total_credits" : "total_calls";
    const labelDescription = metric === "credits" ? "Credits Consumed" : "Call Volume";

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
        const agent = item.agent_type as string;
        const val = metric === "credits" ? Number(item.total_credits.toFixed(2)) : item.total_calls;

        entry[agent] = (entry[agent] || 0) + val;
        agents.add(agent);
    });

    const categories = Array.from(agents);
    const chartData = Array.from(groupMap.values()).map(point => {
        const fullPoint = { ...point };
        categories.forEach(agent => {
            if (fullPoint[agent] === undefined) fullPoint[agent] = 0;
        });
        return fullPoint;
    });

    // Ensure colors and labels match the categories
    const colors = categories.map(agent => AGENT_COLORS[agent] || "slate");

    return (
        <Card className="h-full !bg-card/40 backdrop-blur-sm border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Usage Trends</h3>
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mt-1">
                        {labelDescription} OVER TIME
                    </p>
                </div>
                <Legend
                    categories={categories}
                    colors={colors}
                    className="max-w-xs"
                />
            </div>
            <AreaChart
                className="mt-10 h-80"
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
                showGridLines={false}
                showYAxis={true}
                startEndOnly={false}
            />
        </Card>
    );
}
