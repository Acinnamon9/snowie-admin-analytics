"use client";

import React from "react";
import { AgentType } from "@/types/analytics";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AgentFilterProps {
    activeAgents: Set<AgentType | "all">;
    onToggle: (agent: AgentType | "all") => void;
    className?: string;
}

const AGENTS: { key: AgentType | "all"; label: string; hex: string }[] = [
    { key: "all", label: "All Agents", hex: "" },
    { key: "GeminiVoice", label: "Gemini", hex: "#E8603C" },
    { key: "GrokRealtime", label: "Grok", hex: "#2AA89B" },
    { key: "UltraVoxVoice", label: "UltraVox", hex: "#E9A420" },
    { key: "AvatarAgent", label: "Avatar", hex: "#6366f1" },
    { key: "TextAgent", label: "Text", hex: "#44A870" },
];

export function AgentFilter({ activeAgents, onToggle, className }: AgentFilterProps) {
    const isAllActive = activeAgents.has("all");

    return (
        <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
            {AGENTS.map(({ key, label, hex }) => {
                const isActive = key === "all" ? isAllActive : activeAgents.has(key);
                return (
                    <button
                        key={key}
                        onClick={() => onToggle(key)}
                        className={cn(
                            "flex items-center gap-2 px-3.5 py-[7px] rounded-[10px] text-[12px] font-semibold transition-all duration-300 border",
                            isActive
                                ? "bg-secondary border-border/60 text-foreground shadow-sm"
                                : "bg-transparent border-transparent text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40"
                        )}
                    >
                        {key !== "all" && (
                            <span
                                className={cn(
                                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                    isActive ? "scale-100 opacity-100" : "scale-75 opacity-30"
                                )}
                                style={{ backgroundColor: hex }}
                            />
                        )}
                        {label}
                        {isActive && key === "all" && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-0.5"
                                style={{ backgroundColor: "#E8603C15", color: "#E8603C" }}>
                                5
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
