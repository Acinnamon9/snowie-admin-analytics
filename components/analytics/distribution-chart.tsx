"use client";

import { Card, Title, DonutChart, Text, Flex, Badge } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";

interface DistributionChartProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<AgentType, string> = {
    GeminiVoice: "indigo",
    GrokRealtime: "amber",
    UltraVoxVoice: "emerald",
};

export function DistributionChart({ data, metric }: DistributionChartProps) {
    const totals = data.reduce((acc, curr) => {
        const val = metric === "credits" ? curr.total_credits : curr.total_calls;
        acc[curr.agent_type] = (acc[curr.agent_type] || 0) + val;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(totals).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
    }));

    return (
        <Card className="h-full">
            <Title>Agent Distribution</Title>
            <Text className="text-xs">Market share by {metric}</Text>
            <DonutChart
                className="mt-8 h-56"
                data={chartData}
                category="value"
                index="name"
                valueFormatter={(number: number) =>
                    Intl.NumberFormat("us").format(number).toString()
                }
                colors={["indigo", "amber", "emerald"]}
            />
            <div className="mt-6 space-y-2">
                {chartData.map((item) => (
                    <Flex key={item.name} className="space-x-2">
                        <div className="flex items-center space-x-2">
                            <span className={`h-2 w-2 rounded-full bg-${AGENT_COLORS[item.name as AgentType]}-500`} />
                            <Text className="text-xs truncate">{item.name}</Text>
                        </div>
                        <Badge size="xs" color={AGENT_COLORS[item.name as AgentType] as any}>
                            {item.value.toLocaleString()}
                        </Badge>
                    </Flex>
                ))}
            </div>
        </Card>
    );
}
