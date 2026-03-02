"use client";

import { Card, Title, AreaChart, Text } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";

interface UsageChartProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
    metric: "credits" | "calls";
}

export function UsageChart({ data, metric }: UsageChartProps) {
    const chartKey = metric === "credits" ? "total_credits" : "total_calls";
    const label = metric === "credits" ? "Credits Consumed" : "Call Volume";

    const chartData = data.map((item, index) => ({
        label: (item as DailyAnalytics).date
            ? new Date((item as DailyAnalytics).date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : `Agency ${item.agency_id.toString().slice(-4)}`,
        [label]: metric === "credits" ? Number(item.total_credits.toFixed(2)) : item.total_calls,
    }));

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between">
                <div>
                    <Title>Usage Trends</Title>
                    <Text className="text-xs">Visualizing {metric} over time</Text>
                </div>
            </div>
            <AreaChart
                className="mt-8 h-80"
                data={chartData}
                index="label"
                categories={[label]}
                colors={metric === "credits" ? ["indigo"] : ["blue"]}
                valueFormatter={(number: number) =>
                    Intl.NumberFormat("us").format(number).toString()
                }
                showAnimation={true}
                curveType="monotone"
            />
        </Card>
    );
}
