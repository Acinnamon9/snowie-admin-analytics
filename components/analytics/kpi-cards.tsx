import { memo } from "react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";
import { BarChart3, Clock, Database, CreditCard } from "lucide-react";

interface KpiCardsProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

const CARD_ACCENTS = [
    { gradient: "gradient-coral", hex: "#E8603C", shadow: "rgba(232, 96, 60, 0.2)", borderColor: "rgba(232, 96, 60, 0.15)" },
    { gradient: "gradient-teal", hex: "#2AA89B", shadow: "rgba(42, 168, 155, 0.2)", borderColor: "rgba(42, 168, 155, 0.15)" },
    { gradient: "gradient-amber", hex: "#E9A420", shadow: "rgba(233, 164, 32, 0.2)", borderColor: "rgba(233, 164, 32, 0.15)" },
    { gradient: "gradient-sage", hex: "#44A870", shadow: "rgba(68, 168, 112, 0.2)", borderColor: "rgba(68, 168, 112, 0.15)" },
];

export const KpiCards = memo(function KpiCards({ data }: KpiCardsProps) {
    const totalCalls = data.reduce((acc, curr) => acc + curr.total_calls, 0);
    const totalDuration = data.reduce((acc, curr) => acc + curr.total_duration, 0);
    const totalCredits = data.reduce((acc, curr) => acc + curr.total_credits, 0);
    const activeSchemas = new Set(data.map(item => item.agency_id)).size;

    const stats = [
        {
            title: "Total Credits",
            value: totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            subtext: "Credits Consumed",
            icon: CreditCard,
        },
        {
            title: "Total Calls",
            value: totalCalls.toLocaleString(),
            subtext: "System Call Volume",
            icon: BarChart3,
        },
        {
            title: "Total Duration",
            value: (totalDuration / 60).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "m",
            subtext: "Minutes of Airtime",
            icon: Clock,
        },
        {
            title: "Active Schemas",
            value: activeSchemas.toLocaleString(),
            subtext: "Processing Agencies",
            icon: Database,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, idx) => {
                const accent = CARD_ACCENTS[idx];
                return (
                    <div
                        key={item.title}
                        className="relative overflow-hidden rounded-[20px] transition-all duration-500 group"
                        style={{
                            background: "hsl(var(--card-surface))",
                            border: `1px solid hsl(var(--foreground) / var(--card-border-alpha))`,
                            boxShadow: "var(--card-shadow)",
                        }}
                    >
                        {/* Colored top accent bar */}
                        <div className="h-1 w-full" style={{ background: accent.hex }} />

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {item.title}
                                </span>
                                <div
                                    className={`p-2.5 rounded-[12px] ${accent.gradient}`}
                                    style={{ boxShadow: `0 4px 14px -2px ${accent.shadow}` }}
                                >
                                    <item.icon size={16} className="text-white" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="text-[32px] font-extrabold tracking-tight text-foreground leading-none">
                                    {item.value}
                                </div>
                                <p className="text-[12px] font-medium text-muted-foreground">
                                    {item.subtext}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});
