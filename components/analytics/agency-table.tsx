import { useState, useMemo } from "react";
import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
} from "@tremor/react";
import { DailyAnalytics, WeeklyAnalytics, MonthlyAnalytics, AgentType } from "@/types/analytics";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";

interface AgencyTableProps {
    data: DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
}

type SortColumn = "agency_id" | "company" | "agent_type" | "total_calls" | "total_duration" | "total_credits";
type SortDirection = "asc" | "desc" | null;

const BADGE_HEX: Record<string, string> = {
    "GeminiVoice": "#E8603C",
    "GrokRealtime": "#2AA89B",
    "UltraVoxVoice": "#E9A420",
    "TextAgent": "#44A870",
};

export function AgencyTable({ data }: AgencyTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>("total_credits");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item => {
                const company = ((item as WeeklyAnalytics).agency__company_name || (item as WeeklyAnalytics).agency__schema_name || "").toLowerCase();
                const id = item.agency_id.toString();
                const agent = item.agent_type.toLowerCase();
                return company.includes(q) || id.includes(q) || agent.includes(q);
            });
        }

        if (!sortColumn || !sortDirection) return result;

        return result.sort((a, b) => {
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
    }, [data, sortColumn, sortDirection, searchQuery]);

    const SortIcon = ({ column }: { column: SortColumn }) => {
        if (sortColumn !== column) return <ChevronsUpDown className="ml-1.5 h-3 w-3 opacity-25" />;
        return sortDirection === "asc" ?
            <ChevronUp className="ml-1.5 h-3 w-3 text-[hsl(var(--coral))]" /> :
            <ChevronDown className="ml-1.5 h-3 w-3 text-[hsl(var(--coral))]" />;
    };

    const headerCellClass = "cursor-pointer hover:bg-secondary/50 transition-colors text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground py-3.5";

    return (
        <Card className="overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-[17px] font-bold text-foreground tracking-tight">Agency Breakdown</h3>
                    <p className="text-[12px] font-medium text-muted-foreground mt-1">Performance metrics per agency partner</p>
                </div>
                {/* Search */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search agencies..."
                        className="pl-9 pr-4 py-2.5 rounded-[12px] bg-secondary/60 border border-border/50 text-[13px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--coral)/0.2)] focus:border-[hsl(var(--coral)/0.3)] transition-all w-full sm:w-60"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow className="border-b border-border/60">
                            <TableHeaderCell onClick={() => handleSort("agency_id")} className={headerCellClass}>
                                <div className="flex items-center">Agency ID <SortIcon column="agency_id" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell onClick={() => handleSort("company")} className={headerCellClass}>
                                <div className="flex items-center">Company <SortIcon column="company" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell onClick={() => handleSort("agent_type")} className={headerCellClass}>
                                <div className="flex items-center">Engine <SortIcon column="agent_type" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell onClick={() => handleSort("total_calls")} className={`${headerCellClass} text-right`}>
                                <div className="flex items-center justify-end">Calls <SortIcon column="total_calls" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell onClick={() => handleSort("total_duration")} className={`${headerCellClass} text-right`}>
                                <div className="flex items-center justify-end">Duration <SortIcon column="total_duration" /></div>
                            </TableHeaderCell>
                            <TableHeaderCell onClick={() => handleSort("total_credits")} className={`${headerCellClass} text-right`}>
                                <div className="flex items-center justify-end">Credits <SortIcon column="total_credits" /></div>
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedData.map((item, idx) => {
                            const hex = BADGE_HEX[item.agent_type] || "#94a3b8";
                            return (
                                <TableRow key={`${item.agency_id}-${item.agent_type}-${idx}`} className="hover:bg-secondary/30 transition-colors duration-200 border-b border-border/20">
                                    <TableCell className="font-mono text-[12px] text-muted-foreground tracking-wider">
                                        #{item.agency_id.toString().padStart(4, '0')}
                                    </TableCell>
                                    <TableCell className="font-semibold text-[13px] text-foreground">
                                        {(item as WeeklyAnalytics).agency__company_name || (item as WeeklyAnalytics).agency__schema_name || "Partner"}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg inline-block"
                                            style={{
                                                backgroundColor: `${hex}12`,
                                                color: hex,
                                            }}
                                        >
                                            {item.agent_type.replace("Voice", "").replace("Realtime", "").replace("Agent", "")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-[13px] text-foreground tabular-nums">
                                        {item.total_calls.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right text-[13px] text-muted-foreground font-medium tabular-nums">
                                        {(item.total_duration / 60).toLocaleString(undefined, { maximumFractionDigits: 1 })}m
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-bold text-[13px] text-foreground tabular-nums">
                                            {item.total_credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredAndSortedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16">
                                    <p className="text-muted-foreground/35 text-sm font-medium">No matching results</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
