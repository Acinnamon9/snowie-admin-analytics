"use client";

import { Card, Title, DonutChart, Text, Flex, Badge } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";

interface DistributionChartProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "Gemini": "indigo",
    "Grok": "rose",
    "UltraVox": "amber",
    "Text Agent": "emerald",
};

const AGENT_HEX_COLORS: Record<string, string> = {
    "Gemini": "#6366f1",
    "Grok": "#f43f5e",
    "UltraVox": "#f59e0b",
    "Text Agent": "#10b981",
};

export function DistributionChart({ data, metric }: DistributionChartProps) {
    // Map internal names to display names
    const getAgentLabel = (name: string) => {
        if (name === "GeminiVoice") return "Gemini";
        if (name === "GrokRealtime") return "Grok";
        if (name === "UltraVoxVoice") return "UltraVox";
        if (name === "TextAgent") return "Text Agent";
        return name;
    };

    const totals = data.reduce((acc, curr) => {
        const val = metric === "credits" ? curr.total_credits : curr.total_calls;
        const label = getAgentLabel(curr.agent_type);
        acc[label] = (acc[label] || 0) + val;
        return acc;
    }, {} as Record<string, number>);

    // Create chart data and sort by usage size
    const chartData = Object.keys(totals)
        .map((name) => ({
            name,
            value: Number(totals[name].toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value);

    const categories = chartData.map(d => d.name);
    const colors = categories.map(name => AGENT_COLORS[name] || "slate");

    return (
        <Card className="h-full !bg-card/30 backdrop-blur-xl border-white/10 premium-shadow">
            {/* Tailwind 4 Safelist (Ensures colors aren't tree-shaken) */}
            <div className="hidden">
                <div className="bg-indigo-500 bg-rose-500 bg-amber-500 bg-emerald-500" />
                <div className="text-indigo-500 text-rose-500 text-amber-500 text-emerald-500" />
                <div className="fill-indigo-500 fill-rose-500 fill-amber-500 fill-emerald-500" />
                <div className="stroke-indigo-500 stroke-rose-500 stroke-amber-500 stroke-emerald-500" />
            </div>

            <div>
                <h3 className="text-lg font-bold text-foreground">Agent Distribution</h3>
                <p className="text-xs font-medium text-muted-foreground/60">
                    Market share by {metric}
                </p>
            </div>

            <DonutChart
                className="mt-8 h-48"
                data={chartData}
                category="value"
                index="name"
                valueFormatter={(number: number) =>
                    Intl.NumberFormat("us").format(number).toString()
                }
                colors={colors}
                showAnimation={true}
                variant="donut"
            />

            <div className="mt-8 space-y-3">
                {chartData.map((item) => (
                    <Flex key={item.name} className="group">
                        <div className="flex items-center space-x-2.5">
                            <span
                                className="h-2 w-2 rounded-full shadow-sm"
                                style={{ backgroundColor: AGENT_HEX_COLORS[item.name] || '#cbd5e1' }}
                            />
                            <Text className="text-sm font-medium text-muted-foreground/90 group-hover:text-foreground">
                                {item.name}
                            </Text>
                        </div>
                        <div className="flex items-center gap-3">
                            <Text className="text-sm font-semibold text-foreground">
                                {chartData.reduce((a, b) => a + b.value, 0) > 0
                                    ? Intl.NumberFormat("us", {
                                        style: "percent",
                                        maximumFractionDigits: 1,
                                    }).format(item.value / chartData.reduce((a, b) => a + b.value, 0))
                                    : "0%"}
                            </Text>
                            <Badge
                                size="xs"
                                color={(AGENT_COLORS[item.name] || 'slate') as any}
                                className="font-semibold px-2 py-0.5"
                            >
                                {item.value.toLocaleString()}
                            </Badge>
                        </div>
                    </Flex>
                ))}
            </div>
        </Card>
    );
}
