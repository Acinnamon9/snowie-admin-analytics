"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsResponse, AnalyticsTimeframe } from "@/types/analytics";

async function fetchAnalytics(timeframe: AnalyticsTimeframe): Promise<AnalyticsResponse> {
    const response = await fetch(`/api/analytics?timeframe=${timeframe}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch analytics");
    }

    return response.json();
}

export function useAnalytics(timeframe: AnalyticsTimeframe) {
    return useQuery({
        queryKey: ["analytics", timeframe],
        queryFn: () => fetchAnalytics(timeframe),
    });
}
