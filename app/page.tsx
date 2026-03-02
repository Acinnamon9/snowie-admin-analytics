import { AnalyticsDashboard } from "@/components/analytics/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen mesh-gradient text-foreground font-[family-name:var(--font-geist-sans)] relative transition-colors duration-500">

      <main className="py-12 px-4">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
