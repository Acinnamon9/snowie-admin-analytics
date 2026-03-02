import { AnalyticsDashboard } from "@/components/analytics/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="py-12">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
