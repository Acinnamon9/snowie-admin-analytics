"use client";

import { useQuery } from "@tanstack/react-query";
import { BaseAnalytics } from "@/types/analytics";

interface AgencyMetadata {
    name: string | null;
    uuid: string;
}

export function useAgencyNames() {
    return useQuery({
        queryKey: ["agency-names"],
        queryFn: async () => {
            const response = await fetch("/api/analytics?timeframe=weekly");
            if (!response.ok) return new Map<number, AgencyMetadata>();
            
            const data: BaseAnalytics[] = await response.json();
            const map = new Map<number, AgencyMetadata>();
            
            data.forEach(item => {
                if (item.agency_id && (item.agency__company_name || item.agency__schema_name)) {
                    // Only store if we have metadata
                    if (!map.has(item.agency_id) || (!map.get(item.agency_id)?.name && item.agency__company_name)) {
                         map.set(item.agency_id, {
                            name: item.agency__company_name || null,
                            uuid: item.agency__schema_name || "",
                        });
                    }
                }
            });
            
            return map;
        },
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
    });
}
