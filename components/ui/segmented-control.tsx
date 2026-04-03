"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SegmentedControlProps {
    options: string[];
    value: number;
    onChange: (index: number) => void;
    className?: string;
    size?: "sm" | "md";
}

export function SegmentedControl({ options, value, onChange, className, size = "md" }: SegmentedControlProps) {
    const slotWidth = 100 / options.length;

    return (
        <div className={cn(
            "relative flex items-center p-[3px] rounded-[12px] transition-all duration-300",
            "bg-secondary/80 border border-border/50",
            className
        )}>
            {/* Sliding Pill */}
            <div
                className="absolute rounded-[9px] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
                style={{
                    width: `calc(${slotWidth}% - 4px)`,
                    left: `calc(${value * slotWidth}% + 2px)`,
                    top: "2px",
                    bottom: "2px",
                    background: "hsl(var(--coral))",
                    boxShadow: "0 2px 8px -1px rgba(232, 96, 60, 0.4)",
                }}
            />

            {options.map((option, index) => (
                <button
                    key={option}
                    onClick={() => onChange(index)}
                    className={cn(
                        "relative z-10 flex-1 whitespace-nowrap transition-all duration-300 font-semibold rounded-[9px]",
                        size === "sm" ? "px-3 py-[5px] text-[12px]" : "px-4 py-[7px] text-[13px]",
                        value === index
                            ? "text-white"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
