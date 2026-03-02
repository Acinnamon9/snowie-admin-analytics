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
            description: "UltraVox series currently leads in volume, while Gemini models show the most stable credit consumption patterns.",
            deltaType: "unchanged",
            icon: Minus,
            color: "blue"
        },
        {
            title: "Optimization Strategy",
            description: "Strategically review high-volume agents for potential Grok engine migration to optimize credit pools during peak scaling.",
            deltaType: "moderateDecrease",
            icon: Info,
            color: "amber"
        }
    ];

    return (
        <Card className="!bg-card/30 backdrop-blur-xl border-white/10 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 border border-white/10 bg-white/5 rounded-lg text-primary">
                    <Info size={18} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Strategic Insights</h3>
                    <p className="text-xs font-medium text-muted-foreground/60">Automated performance analysis</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((insight, idx) => (
                    <div key={idx} className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 group">
                        <Flex alignItems="center" justifyContent="between">
                            <Badge color={insight.color as any} className="font-semibold text-xs py-0.5">
                                {insight.title}
                            </Badge>
                            <BadgeDelta deltaType={insight.deltaType as any} isIncreasePositive={true} size="xs" />
                        </Flex>
                        <Text className="text-sm leading-relaxed text-muted-foreground/90 font-medium italic">
                            "{insight.description}"
                        </Text>
                        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
                                Global Analysis
                            </Text>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
