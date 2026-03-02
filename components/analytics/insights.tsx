"use client";

import { Card, Title, Text, Grid, Icon, Flex } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";
import { Lightbulb, TrendingUp, DollarSign, Users } from "lucide-react";

interface InsightsProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

export function Insights({ data }: InsightsProps) {
    const totalCalls = data.reduce((acc, curr) => acc + curr.total_calls, 0);
    const totalCredits = data.reduce((acc, curr) => acc + curr.total_credits, 0);

    // Find top agency
    const agencyTotals = data.reduce((acc, curr) => {
        acc[curr.agency_id] = (acc[curr.agency_id] || 0) + curr.total_credits;
        return acc;
    }, {} as Record<number, number>);

    const topAgencyId = Object.entries(agencyTotals).sort((a, b) => b[1] - a[1])[0]?.[0];

    // Find top agent type
    const agentTotals = data.reduce((acc, curr) => {
        acc[curr.agent_type] = (acc[curr.agent_type] || 0) + curr.total_credits;
        return acc;
    }, {} as Record<string, number>);

    const topAgentType = Object.entries(agentTotals).sort((a, b) => b[1] - a[1])[0]?.[0];

    const insights = [
        {
            title: "Model Leader",
            text: `${topAgentType || "N/A"} is driving the most consumption in this period.`,
            icon: TrendingUp,
            color: "indigo",
        },
        {
            title: "High Usage Agency",
            text: `Agency ${topAgencyId || "N/A"} stands out as the highest spender.`,
            icon: Users,
            color: "blue",
        },
        {
            title: "Average Cost",
            text: `Campaigns are averaging ${(totalCredits / (totalCalls || 1)).toFixed(3)} credits per call.`,
            icon: DollarSign,
            color: "emerald",
        },
    ];

    return (
        <div className="mt-6">
            <SectionHeader icon={Lightbulb} title="Key Insights" />
            <Grid numItemsSm={1} numItemsLg={3} className="gap-6 mt-4">
                {insights.map((item) => (
                    <Card key={item.title} className="bg-muted/30 border-none shadow-none">
                        <Flex justifyContent="start" className="space-x-4">
                            <div className={`p-2 rounded-lg bg-${item.color}-500/10`}>
                                <item.icon className={`h-5 w-5 text-${item.color}-500`} />
                            </div>
                            <div>
                                <Text className="font-bold text-foreground">{item.title}</Text>
                                <Text className="text-xs mt-1">{item.text}</Text>
                            </div>
                        </Flex>
                    </Card>
                ))}
            </Grid>
        </div>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
    return (
        <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-amber-500" />
            <Title className="text-lg font-bold">{title}</Title>
        </div>
    );
}
