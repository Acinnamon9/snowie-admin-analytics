"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center rounded-[12px] p-2.5 border border-border/50 bg-secondary/50 hover:bg-secondary transition-all duration-300 group/btn relative min-w-[42px] min-h-[42px]"
            aria-label="Toggle theme"
        >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-[hsl(var(--amber))]" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-[hsl(var(--amber))]" />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
