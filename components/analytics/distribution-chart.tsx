import { memo } from "react";
import { Card, DonutChart } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";

interface DistributionChartProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "Gemini": "orange",
    "Grok": "cyan",
    "UltraVox": "amber",
    "Text Agent": "emerald",
};

const AGENT_HEX_COLORS: Record<string, string> = {
    "Gemini": "#E8603C",
    "Grok": "#2AA89B",
    "UltraVox": "#E9A420",
    "Text Agent": "#44A870",
};

export const DistributionChart = memo(function DistributionChart({ data, metric }: DistributionChartProps) {
    const getAgentLabel = (name: string) => {
        if (name === "GeminiVoice") return "Gemini";
        if (name === "GrokRealtime") return "Grok";
        if (name === "UltraVoxVoice") return "UltraVox";
        if (name === "TextAgent") return "Text Agent";
        return name;
    };

    const totals = data.reduce((acc, curr) => {
        const val = metric === "credits" ? curr.total_credits : curr.total_calls;
        const label = getAgentLabel(curr.agent_type);
        acc[label] = (acc[label] || 0) + val;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(totals)
        .map((name) => ({
            name,
            value: Number(totals[name].toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value);

    const totalValue = chartData.reduce((a, b) => a + b.value, 0);
    const categories = chartData.map(d => d.name);
    const colors = categories.map(name => AGENT_COLORS[name] || "slate");

    return (
        <Card className="h-full p-6">
            {/* Safelist - split into separate elements to avoid property overlap warnings */}
            <div className="hidden" aria-hidden="true">
                <div className="bg-orange-500" /><div className="bg-cyan-500" /><div className="bg-amber-500" /><div className="bg-emerald-500" />
                <div className="text-orange-500" /><div className="text-cyan-500" /><div className="text-amber-500" /><div className="text-emerald-500" />
                <div className="fill-orange-500" /><div className="fill-cyan-500" /><div className="fill-amber-500" /><div className="fill-emerald-500" />
                <div className="stroke-orange-500" /><div className="stroke-cyan-500" /><div className="stroke-amber-500" /><div className="stroke-emerald-500" />
            </div>

            <div>
                <h3 className="text-[17px] font-bold text-foreground tracking-tight">Agent Distribution</h3>
                <p className="text-[12px] font-medium text-muted-foreground mt-1">
                    Market share by {metric}
                </p>
            </div>

            <DonutChart
                className="mt-8 h-48"
                data={chartData}
                category="value"
                index="name"
                valueFormatter={(number: number) =>
                    Intl.NumberFormat("us").format(number).toString()
                }
                colors={colors}
                showAnimation={true}
                variant="donut"
            />

            <div className="mt-8 space-y-4">
                {chartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: AGENT_HEX_COLORS[item.name] || '#94a3b8' }}
                            />
                            <span className="text-[13px] font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors">
                                {item.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[13px] font-bold text-foreground tabular-nums">
                                {totalValue > 0
                                    ? Intl.NumberFormat("us", { style: "percent", maximumFractionDigits: 1 })
                                        .format(item.value / totalValue)
                                    : "0%"}
                            </span>
                            <span
                                className="text-[12px] font-bold px-2.5 py-1 rounded-lg tabular-nums"
                                style={{
                                    backgroundColor: `${AGENT_HEX_COLORS[item.name]}15`,
                                    color: AGENT_HEX_COLORS[item.name],
                                }}
                            >
                                {item.value.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
});
