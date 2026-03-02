"use client";

import { Card, Text, Metric, Grid, Flex, BadgeDelta } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";

interface KpiCardsProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
    metric: "credits" | "calls";
}

export function KpiCards({ data, metric }: KpiCardsProps) {
    const totalCalls = data.reduce((acc, curr) => acc + curr.total_calls, 0);
    const totalDuration = data.reduce((acc, curr) => acc + curr.total_duration, 0);
    const totalCredits = data.reduce((acc, curr) => acc + curr.total_credits, 0);

    const avgCreditsPerCall = totalCalls > 0 ? (totalCredits / totalCalls).toFixed(4) : "0";

    const stats = [
        {
            title: "Total Volume",
            metric: totalCalls.toLocaleString(),
            subtext: "Calls processed",
            color: "blue",
        },
        {
            title: "Total Airtime",
            metric: (totalDuration / 60).toFixed(1),
            subtext: "Minutes used",
            color: "emerald",
        },
        {
            title: "Total Efficiency",
            metric: totalCredits.toFixed(2),
            subtext: "Credits consumed",
            color: "indigo",
        },
        {
            title: "Avg Cost/Call",
            metric: avgCreditsPerCall,
            subtext: "Credits per call",
            color: "amber",
        },
    ];

    return (
        <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
            {stats.map((item) => (
                <Card key={item.title} decoration="top" decorationColor={item.color as any}>
                    <Text className="text-muted-foreground font-medium uppercase text-xs tracking-wider">{item.title}</Text>
                    <Metric className="mt-1 font-bold">{item.metric}</Metric>
                    <Text className="mt-1 text-xs text-muted-foreground">{item.subtext}</Text>
                </Card>
            ))}
        </Grid>
    );
}
