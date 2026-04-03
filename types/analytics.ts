export type AgentType = "UltraVoxVoice" | "GrokRealtime" | "GeminiVoice" | "AvatarAgent" | "TextAgent";

export interface BaseAnalytics {
    agency_id: number;
    agency__schema_name?: string;
    agency__company_name?: string | null;
    agent_type: AgentType;
    total_calls: number;
    total_duration: number;
    total_credits: number;
}

export interface DailyAnalytics extends BaseAnalytics {
    date?: string;
}

export type WeeklyAnalytics = BaseAnalytics;
export type MonthlyAnalytics = BaseAnalytics;

export type AnalyticsTimeframe = "daily" | "weekly" | "monthly";

export type AnalyticsResponse = DailyAnalytics[] | WeeklyAnalytics[] | MonthlyAnalytics[];
