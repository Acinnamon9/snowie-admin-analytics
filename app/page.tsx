"use client";

import { useState, useEffect } from "react";
import { AnalyticsDashboard } from "@/components/analytics/dashboard";
import { LoginScreen } from "@/components/login-screen";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem("snowie_authenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  // Show nothing while checking auth state (prevents flash)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-coral animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen mesh-gradient text-foreground font-[family-name:var(--font-geist-sans)] relative transition-colors duration-500 overflow-x-hidden">
      <main className="py-12 px-4">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
