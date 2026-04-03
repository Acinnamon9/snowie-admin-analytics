import { useState, memo } from "react";
import { Card } from "@tremor/react";
import { SegmentedControl } from "../ui/segmented-control";
import { AnalyticsResponse, DailyAnalytics } from "@/types/analytics";
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip 
} from "recharts";

interface UsageChartProps {
    data: AnalyticsResponse;
    metric: "credits" | "calls";
}

const AGENT_COLORS: Record<string, string> = {
    "Gemini": "#f97316", // orange-500
    "Grok": "#06b6d4", // cyan-500
    "UltraVox": "#f59e0b", // amber-500
    "Avatar": "#6366f1", // indigo-500
    "Text Agent": "#10b981", // emerald-500
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: { color: string; name: string; value: number }[];
    label?: string;
    valueFormatter: (val: number) => string;
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/95 backdrop-blur-sm border border-border/50 p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
                <p className="text-[12px] font-bold text-muted-foreground mb-2 px-1">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-8 py-0.5 px-1 rounded-md hover:bg-secondary/20 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[13px] font-medium text-foreground/80">{entry.name}</span>
                            </div>
                            <span className="text-[13px] font-bold text-foreground tabular-nums">
                                {valueFormatter(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const UsageChart = memo(function UsageChart({ data, metric }: UsageChartProps) {
    const [isLogScale, setIsLogScale] = useState(false);
    const labelDescription = metric === "credits" ? "Credits Consumed" : "Call Volume";

    const getAgentLabel = (name: string) => {
        if (name === "GeminiVoice") return "Gemini";
        if (name === "GrokRealtime") return "Grok";
        if (name === "UltraVoxVoice") return "UltraVox";
        if (name === "AvatarAgent") return "Avatar";
        if (name === "TextAgent") return "Text Agent";
        return name;
    };

    const groupMap = new Map<string, Record<string, number | string>>();
    const agents = new Set<string>();

    data.forEach(item => {
        const dateLabel = (item as DailyAnalytics).date
            ? new Date((item as DailyAnalytics).date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : `Agency ${item.agency_id.toString().slice(-4)}`;

        if (!groupMap.has(dateLabel)) {
            groupMap.set(dateLabel, { label: dateLabel });
        }

        const entry = groupMap.get(dateLabel)!;
        const agentDisplayName = getAgentLabel(item.agent_type);
        const val = metric === "credits" ? Number(item.total_credits.toFixed(2)) : item.total_calls;

        entry[agentDisplayName] = (Number(entry[agentDisplayName]) || 0) + val;
        agents.add(agentDisplayName);
    });

    const agentTotals = new Map<string, number>();
    data.forEach(item => {
        const agentLabel = getAgentLabel(item.agent_type);
        const val = metric === "credits" ? item.total_credits : item.total_calls;
        agentTotals.set(agentLabel, (agentTotals.get(agentLabel) || 0) + val);
    });

    const categories = Array.from(agents).sort((a, b) => (agentTotals.get(b) || 0) - (agentTotals.get(a) || 0));

    const chartData = Array.from(groupMap.values()).map(point => {
        const fullPoint = { ...point };
        categories.forEach(agent => {
            if (fullPoint[agent] === undefined) fullPoint[agent] = 0;
        });
        return fullPoint;
    });


    const valueFormatter = (number: number) =>
        Intl.NumberFormat("us").format(number).toString();

    return (
        <Card className="h-full p-6">
            {/* Safelist - split into separate elements to avoid property overlap warnings */}
            <div className="hidden" aria-hidden="true">
                <div className="bg-orange-500" /><div className="bg-cyan-500" /><div className="bg-amber-500" /><div className="bg-emerald-500" />
                <div className="text-orange-500" /><div className="text-cyan-500" /><div className="text-amber-500" /><div className="text-emerald-500" />
                <div className="fill-orange-500" /><div className="fill-cyan-500" /><div className="fill-amber-500" /><div className="fill-emerald-500" />
                <div className="stroke-orange-500" /><div className="stroke-cyan-500" /><div className="stroke-amber-500" /><div className="stroke-emerald-500" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[17px] font-bold text-foreground tracking-tight">Usage Trends</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-[12px] font-medium text-muted-foreground">
                            {labelDescription}
                        </p>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <SegmentedControl 
                            options={["Linear", "Log"]}
                            value={isLogScale ? 1 : 0}
                            onChange={(idx: number) => setIsLogScale(idx === 1)}
                            size="sm"
                            className="w-[120px]"
                        />
                    </div>
                </div>
                {/* Custom Legend to replace Tremor's */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 sm:mt-0">
                    {categories.map((agent) => (
                        <div key={agent} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: AGENT_COLORS[agent] || "#94a3b8" }} />
                            <span className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">{agent}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            {categories.map((agent) => (
                                <linearGradient key={`gradient-${agent}`} id={`gradient-${agent}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={AGENT_COLORS[agent] || "#94a3b8"} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={AGENT_COLORS[agent] || "#94a3b8"} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid 
                            vertical={false} 
                            strokeDasharray="3 3" 
                            stroke="hsl(var(--border))" 
                            opacity={0.3} 
                        />
                        <XAxis 
                            dataKey="label" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                            tickFormatter={(val) => Intl.NumberFormat("us", { notation: "compact", maximumFractionDigits: 1 }).format(val)}
                            domain={isLogScale ? [1, 'auto'] : [0, 'auto']}
                            scale={isLogScale ? 'log' : 'auto'}
                            width={64}
                        />
                        <Tooltip 
                            content={<CustomTooltip valueFormatter={valueFormatter} />} 
                            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        {categories.map((agent) => (
                            <Area
                                key={agent}
                                type="monotone"
                                dataKey={agent}
                                name={agent}
                                stackId="1"
                                stroke={AGENT_COLORS[agent] || "#94a3b8"}
                                strokeWidth={2}
                                fill={`url(#gradient-${agent})`}
                                fillOpacity={1}
                                activeDot={{ r: 5, strokeWidth: 0, fill: AGENT_COLORS[agent] }}
                                animationDuration={1000}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
});
