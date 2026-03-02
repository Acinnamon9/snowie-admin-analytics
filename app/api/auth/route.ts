import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json({ success: false, error: "Password required" }, { status: 400 });
        }

        // Compare directly — ADMIN_PASSWORD is server-side only (no NEXT_PUBLIC_ prefix)
        const storedPassword = process.env.ADMIN_PASSWORD;

        if (!storedPassword) {
            console.error("ADMIN_PASSWORD not configured in environment variables");
            return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
        }

        if (password === storedPassword) {
            const response = NextResponse.json({ success: true });

            // Set httpOnly cookie for session persistence
            response.cookies.set("snowie_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });

            return response;
        } else {
            return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
}
