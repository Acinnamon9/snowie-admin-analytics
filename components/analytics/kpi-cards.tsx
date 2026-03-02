import { Card, Text, Metric, Icon } from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics } from "@/types/analytics";
import { BarChart3, Clock, Database, CreditCard } from "lucide-react";

interface KpiCardsProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
    metric: "credits" | "calls";
}

export function KpiCards({ data, metric }: KpiCardsProps) {
    const totalCalls = data.reduce((acc, curr) => acc + curr.total_calls, 0);
    const totalDuration = data.reduce((acc, curr) => acc + curr.total_duration, 0);
    const totalCredits = data.reduce((acc, curr) => acc + curr.total_credits, 0);

    // Total Active Schemas = number of unique agency IDs in the current dataset
    const activeSchemas = new Set(data.map(item => item.agency_id)).size;

    const stats = [
        {
            title: "Total Credits",
            metric: totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            subtext: "Credits Consumed",
            color: "indigo",
            icon: CreditCard,
        },
        {
            title: "Total Calls",
            metric: totalCalls.toLocaleString(),
            subtext: "System Call Volume",
            color: "blue",
            icon: BarChart3,
        },
        {
            title: "Total Duration",
            metric: (totalDuration / 60).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "m",
            subtext: "Minutes of Airtime",
            color: "emerald",
            icon: Clock,
        },
        {
            title: "Active Schemas",
            metric: activeSchemas.toLocaleString(),
            subtext: "Processing Agencies",
            color: "amber",
            icon: Database,
        },
    ];

    const colorMap: Record<string, string> = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20",
        blue: "text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
        amber: "text-amber-600 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
                <Card
                    key={item.title}
                    className="!bg-card/30 backdrop-blur-xl border-white/10 shadow-lg p-6 relative group overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-muted-foreground/80">
                            {item.title}
                        </span>
                        <div className={`p-2 rounded-lg border ${colorMap[item.color]}`}>
                            <item.icon size={16} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Metric className="text-3xl font-bold tracking-tight text-foreground">
                            {item.metric}
                        </Metric>
                        <Text className="text-xs font-medium text-muted-foreground/60">
                            {item.subtext}
                        </Text>
                    </div>
                </Card>
            ))}
        </div>
    );
}
