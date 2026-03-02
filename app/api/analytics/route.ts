import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://app.snowie.ai/api";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "daily"; // daily, weekly, monthly

    const AUTH_KEY = process.env.SUPER_USER_AUTH_KEY;

    if (!AUTH_KEY) {
        return NextResponse.json(
            { error: "Internal Server Error: Missing API Key" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${timeframe}/`, {
            method: "GET",
            headers: {
                "SUPER_USER_AUTH_KEY": AUTH_KEY,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            return NextResponse.json(
                { error: `API Error: ${response.statusText}`, detail: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Analytics Proxy Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics data" },
            { status: 500 }
        );
    }
}
