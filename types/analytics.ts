export type AgentType = "UltraVoxVoice" | "GrokRealtime" | "GeminiVoice";

export interface DailyAnalytics {
    date: string;
    agency_id: number;
    agent_type: AgentType;
    total_calls: number;
    total_duration: number;
    total_credits: number;
}

export interface WeeklyAnalytics {
    agency_id: number;
    agency__schema_name: string;
    agency__company_name: string | null;
    agent_type: AgentType;
    total_calls: number;
    total_duration: number;
    total_credits: number;
}

export interface MonthlyAnalytics {
    agency_id: number;
    agency__schema_name: string;
    agency__company_name: string | null;
    agent_type: AgentType;
    total_calls: number;
    total_duration: number;
    total_credits: number;
}

export type AnalyticsTimeframe = "daily" | "weekly" | "monthly";

export type AnalyticsResponse = DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
