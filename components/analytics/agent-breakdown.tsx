import { memo } from "react";
import { Card } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";

interface AgentBreakdownProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

const AGENT_LABELS: Record<string, string> = {
    "GeminiVoice": "Gemini",
    "GrokRealtime": "Grok",
    "UltraVoxVoice": "UltraVox",
    "AvatarAgent": "Avatar",
    "TextAgent": "Text Agent",
};

const AGENT_HEX: Record<string, string> = {
    "GeminiVoice": "#E8603C",
    "GrokRealtime": "#2AA89B",
    "UltraVoxVoice": "#E9A420",
    "AvatarAgent": "#6366f1",
    "TextAgent": "#44A870",
};

export const AgentBreakdown = memo(function AgentBreakdown({ data }: AgentBreakdownProps) {
    const breakdown = data.reduce((acc, curr) => {
        const type = curr.agent_type;
        if (!acc[type]) {
            acc[type] = { type, calls: 0, duration: 0, credits: 0 };
        }
        acc[type].calls += curr.total_calls;
        acc[type].duration += curr.total_duration;
        acc[type].credits += curr.total_credits;
        return acc;
    }, {} as Record<string, { type: AgentType; calls: number; duration: number; credits: number }>);

    const sortedBreakdown = Object.values(breakdown).sort((a, b) => b.credits - a.credits);
    const totalCredits = sortedBreakdown.reduce((a, b) => a + b.credits, 0);

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-[17px] font-bold text-foreground tracking-tight">Agent Type Breakdown</h3>
                <p className="text-[12px] font-medium text-muted-foreground mt-1">
                    Performance and usage metrics per model engine
                </p>
            </div>

            {/* Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_80px] gap-4 pb-3 mb-1 border-b border-border/60">
                {["Agent Engine", "Calls", "Duration", "Credits", "Share"].map((label) => (
                    <span key={label} className={`text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground ${label !== "Agent Engine" ? "text-right" : ""}`}>
                        {label}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/30">
                {sortedBreakdown.map((item) => {
                    const hex = AGENT_HEX[item.type] || "#94a3b8";
                    const pct = totalCredits > 0 ? (item.credits / totalCredits) * 100 : 0;
                    return (
                        <div
                            key={item.type}
                            className="grid grid-cols-[1.5fr_1fr_1fr_1fr_80px] gap-4 py-4 items-center group hover:bg-secondary/30 -mx-3 px-3 rounded-xl transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hex, boxShadow: `0 0 10px ${hex}40` }} />
                                <span className="text-[13px] font-semibold text-foreground">
                                    {AGENT_LABELS[item.type] || item.type}
                                </span>
                            </div>
                            <span className="text-[13px] font-medium text-foreground text-right tabular-nums">
                                {item.calls.toLocaleString()}
                            </span>
                            <span className="text-[13px] font-medium text-muted-foreground text-right tabular-nums">
                                {(item.duration / 60).toLocaleString(undefined, { maximumFractionDigits: 1 })}m
                            </span>
                            <span className="text-[13px] font-bold text-foreground text-right tabular-nums">
                                {item.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <div className="flex items-center justify-end">
                                <span
                                    className="text-[12px] font-bold px-2.5 py-1 rounded-lg tabular-nums"
                                    style={{ backgroundColor: `${hex}15`, color: hex }}
                                >
                                    {pct.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
});
