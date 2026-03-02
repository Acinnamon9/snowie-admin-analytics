"use client";

import { Card, Title, DonutChart, Text, Flex, Badge } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";

interface DistributionChartProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "GeminiVoice": "blue",
    "GrokRealtime": "violet",
    "UltraVoxVoice": "orange",
};

export function DistributionChart({ data, metric }: DistributionChartProps) {
    const totals = data.reduce((acc, curr) => {
        const val = metric === "credits" ? curr.total_credits : curr.total_calls;
        acc[curr.agent_type] = (acc[curr.agent_type] || 0) + val;
        return acc;
    }, {} as Record<string, number>);

    const categories = Object.keys(totals);
    const chartData = categories.map((name) => ({
        name,
        value: Number(totals[name].toFixed(2)),
    }));

    const colors = categories.map(name => AGENT_COLORS[name] || "slate");

    return (
        <Card className="h-full">
            <div>
                <Title className="text-xl font-bold tracking-tight">Agent Distribution</Title>
                <Text className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mt-1">Market share by {metric}</Text>
            </div>
            <DonutChart
                className="mt-8 h-56"
                data={chartData}
                category="value"
                index="name"
                valueFormatter={(number: number) =>
                    Intl.NumberFormat("us").format(number).toString()
                }
                colors={colors}
                showAnimation={true}
            />
            <div className="mt-8 space-y-3">
                {chartData.map((item) => (
                    <Flex key={item.name} className="group transition-opacity duration-300">
                        <div className="flex items-center space-x-3">
                            <span className={`h-2 w-2 rounded-full bg-${AGENT_COLORS[item.name] || 'slate'}-500 shadow-[0_0_8px_rgba(0,0,0,0.2)]`} />
                            <Text className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">{item.name}</Text>
                        </div>
                        <Badge size="xs" color={(AGENT_COLORS[item.name] || 'slate') as any} className="font-mono font-bold">
                            {item.value.toLocaleString()}
                        </Badge>
                    </Flex>
                ))}
            </div>
        </Card>
    );
}
