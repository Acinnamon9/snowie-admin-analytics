"use client";

import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
    Title,
    Badge,
} from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";

interface AgencyTableProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

export function AgencyTable({ data }: AgencyTableProps) {
    const getBadgeColor = (type: AgentType) => {
        switch (type) {
            case "GeminiVoice": return "blue";
            case "GrokRealtime": return "violet";
            case "UltraVoxVoice": return "orange";
            case "TextAgent": return "emerald";
            default: return "slate";
        }
    };

    return (
        <Card className="overflow-hidden border-none shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Agency Breakdown</h3>
                    <p className="text-sm text-muted-foreground">Real-time performance metrics per agency partner.</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow className="border-white/5 bg-muted/20">
                            <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Agency</TableHeaderCell>
                            <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Company</TableHeaderCell>
                            <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Model</TableHeaderCell>
                            <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 text-right">Calls</TableHeaderCell>
                            <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 text-right">Duration</TableHeaderCell>
                            <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 text-right">Credits</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, idx) => (
                            <TableRow key={`${item.agency_id}-${item.agent_type}-${idx}`} className="hover:bg-white/5 transition-colors duration-200 border-white/5">
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    #{item.agency_id.toString().padStart(4, '0')}
                                </TableCell>
                                <TableCell className="font-semibold text-sm">
                                    {(item as WeeklyAnalytics).agency__company_name || "Enterprise Partner"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        color={getBadgeColor(item.agent_type) as any}
                                        className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                                    >
                                        {item.agent_type.replace("Voice", "").replace("Realtime", "").replace("Agent", "")}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold text-sm">
                                    {item.total_calls.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                    {(item.total_duration / 60).toFixed(1)}m
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="inline-flex items-center gap-1.5 font-mono font-bold text-primary">
                                        {item.total_credits.toFixed(3)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
