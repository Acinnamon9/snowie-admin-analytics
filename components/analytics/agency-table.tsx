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
            case "GrokRealtime": return "purple";
            case "UltraVoxVoice": return "orange";
            default: return "slate";
        }
    };

    return (
        <Card className="mt-6">
            <Title>Agency Breakdown</Title>
            <Text>Detailed usage stats per agency and agent type.</Text>
            <Table className="mt-5">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Agency ID</TableHeaderCell>
                        <TableHeaderCell>Company</TableHeaderCell>
                        <TableHeaderCell>Agent Type</TableHeaderCell>
                        <TableHeaderCell>Calls</TableHeaderCell>
                        <TableHeaderCell>Duration (s)</TableHeaderCell>
                        <TableHeaderCell>Credits</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, idx) => (
                        <TableRow key={`${item.agency_id}-${item.agent_type}-${idx}`}>
                            <TableCell>{item.agency_id}</TableCell>
                            <TableCell>
                                {(item as WeeklyAnalytics).agency__company_name || "N/A"}
                            </TableCell>
                            <TableCell>
                                <Badge color={getBadgeColor(item.agent_type)}>
                                    {item.agent_type}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Text>{item.total_calls}</Text>
                            </TableCell>
                            <TableCell>
                                <Text>{item.total_duration}</Text>
                            </TableCell>
                            <TableCell>
                                <Text>{item.total_credits.toFixed(3)}</Text>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
