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
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
    const slotWidth = 100 / options.length;

    return (
        <div className={cn(
            "relative flex items-center p-1 glass-card !bg-muted/30 border-none rounded-xl",
            className
        )}>
            {/* Sliding Pill */}
            <div
                className="absolute h-[calc(100%-8px)] rounded-lg bg-white dark:bg-primary shadow-sm transition-all duration-300 ease-in-out z-0"
                style={{
                    width: `calc(${slotWidth}% - 8px)`,
                    left: `calc(${value * slotWidth}% + 4px)`,
                }}
            />

            {/* Options */}
            {options.map((option, index) => (
                <button
                    key={option}
                    onClick={() => onChange(index)}
                    className={cn(
                        "relative z-10 flex-1 px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                        value === index
                            ? "text-primary dark:text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
