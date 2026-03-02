"use client";

import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";

interface AgentBreakdownProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

const AGENT_LABELS: Record<string, string> = {
    "GeminiVoice": "Gemini",
    "GrokRealtime": "Grok",
    "UltraVoxVoice": "UltraVox",
    "TextAgent": "Text Agent",
};

const AGENT_COLORS: Record<string, string> = {
    "GeminiVoice": "indigo",
    "GrokRealtime": "rose",
    "UltraVoxVoice": "amber",
    "TextAgent": "emerald",
};

const DOT_COLORS: Record<string, string> = {
    "GeminiVoice": "bg-indigo-500 shadow-indigo-500/50",
    "GrokRealtime": "bg-rose-500 shadow-rose-500/50",
    "UltraVoxVoice": "bg-amber-500 shadow-amber-500/50",
    "TextAgent": "bg-emerald-500 shadow-emerald-500/50",
};

export function AgentBreakdown({ data }: AgentBreakdownProps) {
    const breakdown = data.reduce((acc, curr) => {
        const type = curr.agent_type;
        if (!acc[type]) {
            acc[type] = {
                type,
                calls: 0,
                duration: 0,
                credits: 0,
            };
        }
        acc[type].calls += curr.total_calls;
        acc[type].duration += curr.total_duration;
        acc[type].credits += curr.total_credits;
        return acc;
    }, {} as Record<string, { type: AgentType; calls: number; duration: number; credits: number }>);

    const sortedBreakdown = Object.values(breakdown).sort((a, b) => b.credits - a.credits);

    return (
        <Card className="!bg-card/30 backdrop-blur-xl border-white/10 shadow-lg p-6">
            {/* Tailwind 4 Safelist */}
            <div className="hidden">
                <div className="bg-indigo-500 bg-rose-500 bg-amber-500 bg-emerald-500" />
                <div className="text-indigo-500 text-rose-500 text-amber-500 text-emerald-500" />
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">Agent Type Breakdown</h3>
                <p className="text-xs font-medium text-muted-foreground/60">
                    Performance and usage metrics per model engine
                </p>
            </div>

            <Table>
                <TableHead>
                    <TableRow className="border-b border-white/5">
                        <TableHeaderCell className="text-sm font-semibold text-muted-foreground/80">Agent Engine</TableHeaderCell>
                        <TableHeaderCell className="text-sm font-semibold text-muted-foreground/80 text-right">Calls</TableHeaderCell>
                        <TableHeaderCell className="text-sm font-semibold text-muted-foreground/80 text-right">Duration (min)</TableHeaderCell>
                        <TableHeaderCell className="text-sm font-semibold text-muted-foreground/80 text-right">Credits</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedBreakdown.map((item) => (
                        <TableRow key={item.type} className="hover:bg-white/5 transition-colors">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${DOT_COLORS[item.type]}`} />
                                    <span className="font-semibold text-sm text-foreground">
                                        {AGENT_LABELS[item.type] || item.type}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Text className="text-sm font-medium text-foreground">
                                    {item.calls.toLocaleString()}
                                </Text>
                            </TableCell>
                            <TableCell className="text-right">
                                <Text className="text-sm font-medium text-foreground">
                                    {(item.duration / 60).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                </Text>
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge color={AGENT_COLORS[item.type] as any} className="font-bold">
                                    {item.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
