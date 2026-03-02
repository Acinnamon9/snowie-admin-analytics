"use client";

import { Card, Title, AreaChart, Text } from "@tremor/react";
import { DailyAnalytics, AgentType } from "@/types/analytics";

interface UsageChartProps {
    data: any[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "GeminiVoice": "blue",
    "GrokRealtime": "violet",
    "UltraVoxVoice": "orange",
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

    // Ensure colors match the categories
    const colors = categories.map(agent => AGENT_COLORS[agent] || "slate");

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between">
                <div>
                    <Title>Usage Trends</Title>
                    <Text className="text-xs">Visualizing {labelDescription} by Agent Model</Text>
                </div>
            </div>
            <AreaChart
                className="mt-8 h-80"
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
            />
        </Card>
    );
}
