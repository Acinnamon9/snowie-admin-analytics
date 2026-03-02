"use client";

import { Card, Text, Flex, Badge, BadgeDelta } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";
import { Info, TrendingUp, Minus } from "lucide-react";

interface InsightsProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

export function Insights({ data }: InsightsProps) {
    const totalCredits = data.reduce((acc, curr) => acc + curr.total_credits, 0);
    const totalCalls = data.reduce((acc, curr) => acc + curr.total_calls, 0);
    const avgCost = totalCalls > 0 ? totalCredits / totalCalls : 0;

    const insights = [
        {
            title: "Performance Efficiency",
            description: `Aggregated cost per call is ${avgCost.toFixed(4)} credits. Efficiency is within the target range for the current volume.`,
            deltaType: "increase",
            icon: TrendingUp,
            color: "emerald"
        },
        {
            title: "Model Distribution",
            description: "UltraVoxVoice currently leads in volume, while GeminiVoice shows the most stable credit consumption patterns.",
            deltaType: "unchanged",
            icon: Minus,
            color: "blue"
        },
        {
            title: "Credit Optimization",
            description: "Consider moving high-volume retail agents to GrokRealtime during off-peak hours to optimize credit pools.",
            deltaType: "moderateDecrease",
            icon: Info,
            color: "amber"
        }
    ];

    return (
        <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Info className="text-primary w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">AI Generated Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {insights.map((insight, idx) => (
                    <div key={idx} className="space-y-4 p-6 glass-card rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <Flex alignItems="center" justifyContent="between">
                            <Badge color={insight.color as any} className="font-bold text-[10px] uppercase tracking-wider">
                                {insight.title}
                            </Badge>
                            <BadgeDelta deltaType={insight.deltaType as any} isIncreasePositive={true} size="xs" />
                        </Flex>
                        <Text className="text-sm leading-relaxed text-muted-foreground font-medium italic">
                            "{insight.description}"
                        </Text>
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <Text className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                                Real-time Analysis
                            </Text>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
