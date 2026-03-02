import { useState, useMemo } from "react";
import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
    Badge,
} from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface AgencyTableProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

type SortColumn = "agency_id" | "company" | "agent_type" | "total_calls" | "total_duration" | "total_credits";
type SortDirection = "asc" | "desc" | null;

export function AgencyTable({ data }: AgencyTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>("total_credits");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const getBadgeColor = (type: AgentType) => {
        switch (type) {
            case "GeminiVoice": return "indigo";
            case "GrokRealtime": return "rose";
            case "UltraVoxVoice": return "amber";
            case "TextAgent": return "emerald";
            default: return "slate";
        }
    };

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            if (sortDirection === "desc") setSortDirection("asc");
            else if (sortDirection === "asc") {
                setSortColumn("total_credits");
                setSortDirection("desc");
            }
        } else {
            setSortColumn(column);
            setSortDirection("desc");
        }
    };

    const sortedData = useMemo(() => {
        if (!sortColumn || !sortDirection) return data;

        return [...data].sort((a, b) => {
            let aVal: any;
            let bVal: any;

            if (sortColumn === "company") {
                aVal = (a as WeeklyAnalytics).agency__company_name || (a as WeeklyAnalytics).agency__schema_name || "";
                bVal = (b as WeeklyAnalytics).agency__company_name || (b as WeeklyAnalytics).agency__schema_name || "";
            } else {
                aVal = a[sortColumn as keyof typeof a];
                bVal = b[sortColumn as keyof typeof b];
            }

            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortColumn, sortDirection]);

    const SortIcon = ({ column }: { column: SortColumn }) => {
        if (sortColumn !== column) return <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />;
        return sortDirection === "asc" ?
            <ChevronUp className="ml-1 h-3 w-3 text-primary" /> :
            <ChevronDown className="ml-1 h-3 w-3 text-primary" />;
    };

    return (
        <Card className="overflow-hidden !bg-card/30 backdrop-blur-xl border-white/10 shadow-lg">
            <div className="p-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Agency Breakdown</h3>
                    <p className="text-xs font-medium text-muted-foreground/60">Performance metrics per agency partner.</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow className="border-b border-white/5 bg-white/5">
                            <TableHeaderCell
                                onClick={() => handleSort("agency_id")}
                                className="cursor-pointer hover:bg-white/5 transition-colors text-sm font-semibold text-muted-foreground/80 py-4"
                            >
                                <div className="flex items-center">Agency ID <SortIcon column="agency_id" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                onClick={() => handleSort("company")}
                                className="cursor-pointer hover:bg-white/5 transition-colors text-sm font-semibold text-muted-foreground/80 py-4"
                            >
                                <div className="flex items-center">Company <SortIcon column="company" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                onClick={() => handleSort("agent_type")}
                                className="cursor-pointer hover:bg-white/5 transition-colors text-sm font-semibold text-muted-foreground/80 py-4"
                            >
                                <div className="flex items-center">Model Engine <SortIcon column="agent_type" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                onClick={() => handleSort("total_calls")}
                                className="cursor-pointer hover:bg-white/5 transition-colors text-sm font-semibold text-muted-foreground/80 py-4 text-right"
                            >
                                <div className="flex items-center justify-end">Calls <SortIcon column="total_calls" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                onClick={() => handleSort("total_duration")}
                                className="cursor-pointer hover:bg-white/5 transition-colors text-sm font-semibold text-muted-foreground/80 py-4 text-right"
                            >
                                <div className="flex items-center justify-end">Duration <SortIcon column="total_duration" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                onClick={() => handleSort("total_credits")}
                                className="cursor-pointer hover:bg-white/5 transition-colors text-sm font-semibold text-muted-foreground/80 py-4 text-right"
                            >
                                <div className="flex items-center justify-end">Credits <SortIcon column="total_credits" /></div>
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((item, idx) => (
                            <TableRow key={`${item.agency_id}-${item.agent_type}-${idx}`} className="hover:bg-white/5 transition-colors border-white/5">
                                <TableCell className="font-medium text-xs text-muted-foreground">
                                    #{item.agency_id.toString().padStart(4, '0')}
                                </TableCell>
                                <TableCell className="font-semibold text-sm text-foreground">
                                    {(item as WeeklyAnalytics).agency__company_name || (item as WeeklyAnalytics).agency__schema_name || "Partner"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        color={getBadgeColor(item.agent_type) as any}
                                        className="rounded-lg font-semibold"
                                    >
                                        {item.agent_type.replace("Voice", "").replace("Realtime", "").replace("Agent", "")}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold text-sm text-foreground">
                                    {item.total_calls.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground/80 font-medium">
                                    {(item.total_duration / 60).toLocaleString(undefined, { maximumFractionDigits: 1 })}m
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="font-bold text-sm text-foreground">
                                        {item.total_credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
