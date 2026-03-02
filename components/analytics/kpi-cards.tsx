import { Card, Text, Metric, Grid, Icon } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";
import { Activity, Clock, Zap, CreditCard } from "lucide-react";

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
            subtext: "Total calls processed",
            color: "blue",
            icon: Activity,
            gradient: "from-blue-500/10 to-transparent"
        },
        {
            title: "Total Airtime",
            metric: (totalDuration / 60).toFixed(1),
            subtext: "Minutes of uptime",
            color: "emerald",
            icon: Clock,
            gradient: "from-emerald-500/10 to-transparent"
        },
        {
            title: "Total Usage",
            metric: totalCredits.toFixed(2),
            subtext: "Credits consumed",
            color: "indigo",
            icon: Zap,
            gradient: "from-indigo-500/10 to-transparent"
        },
        {
            title: "Avg Cost/Call",
            metric: avgCreditsPerCall,
            subtext: "Credits per unit",
            color: "amber",
            icon: CreditCard,
            gradient: "from-amber-500/10 to-transparent"
        },
    ];

    return (
        <Grid numItemsSm={2} numItemsLg={4} className="gap-8">
            {stats.map((item) => (
                <Card
                    key={item.title}
                    className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50`} />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                                {item.title}
                            </span>
                            <div className={`p-2 rounded-lg bg-${item.color}-500/10 text-${item.color}-500 group-hover:bg-${item.color}-500 group-hover:text-white transition-colors duration-300`}>
                                <item.icon size={16} />
                            </div>
                        </div>
                        <Metric className="text-3xl font-black tracking-tight">{item.metric}</Metric>
                        <Text className="mt-2 text-xs font-medium text-muted-foreground/60">{item.subtext}</Text>
                    </div>
                </Card>
            ))}
        </Grid>
    );
}
