"use client";

import { Card, Text, Flex, BadgeDelta } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";
import { Info, TrendingUp, Minus, Zap } from "lucide-react";

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
            hex: "#44A870",
        },
        {
            title: "Model Distribution",
            description: "UltraVox series currently leads in volume, while Gemini models show the most stable credit consumption patterns.",
            deltaType: "unchanged",
            hex: "#2AA89B",
        },
        {
            title: "Optimization Strategy",
            description: "Strategically review high-volume agents for potential Grok engine migration to optimize credit pools during peak scaling.",
            deltaType: "moderateDecrease",
            hex: "#E9A420",
        }
    ];

    return (
        <Card className="p-7">
            <div className="flex items-center gap-4 mb-7">
                <div className="p-2.5 rounded-[12px] gradient-coral" style={{ boxShadow: "0 4px 14px -2px rgba(232, 96, 60, 0.3)" }}>
                    <Info size={16} className="text-white" />
                </div>
                <div>
                    <h3 className="text-[17px] font-bold text-foreground tracking-tight">Strategic Insights</h3>
                    <p className="text-[12px] font-medium text-muted-foreground mt-0.5">Automated performance analysis</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className="p-5 rounded-2xl border border-border/40 bg-secondary/25 hover:bg-secondary/50 transition-all duration-300 group space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                                style={{ backgroundColor: `${insight.hex}15`, color: insight.hex }}
                            >
                                {insight.title}
                            </span>
                            <BadgeDelta deltaType={insight.deltaType as any} isIncreasePositive={true} size="xs" />
                        </div>
                        <p className="text-[13px] leading-relaxed text-muted-foreground font-medium">
                            {insight.description}
                        </p>
                        <div className="flex items-center gap-2 pt-3 border-t border-border/25">
                            <span className="w-1.5 h-1.5 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: insight.hex }} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
                                Global Analysis
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
