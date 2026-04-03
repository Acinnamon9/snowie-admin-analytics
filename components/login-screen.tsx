"use client";

import React, { useState } from "react";
import { Activity, Lock, Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react";

interface LoginScreenProps {
    onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                // Store auth state in localStorage
                localStorage.setItem("snowie_authenticated", "true");
                onLogin();
            } else {
                setError("Incorrect password");
                setShake(true);
                setTimeout(() => setShake(false), 600);
                setPassword("");
            }
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
            <div className="w-full max-w-[420px]">
                {/* Logo + Title */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-coral mb-5" style={{ boxShadow: "0 8px 30px -4px rgba(232, 96, 60, 0.4)" }}>
                        <Activity size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-2">
                        Snowie Analytics
                        <Sparkles size={16} className="text-[hsl(var(--amber))]" />
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground mt-2">
                        Enter your admin password to continue
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className={`dash-card p-8 ${shake ? "animate-shake" : ""}`}
                    style={{ borderRadius: "1.5rem" }}
                >
                    <div className="flex items-center gap-3 mb-7">
                        <div className="p-2 rounded-xl bg-secondary">
                            <ShieldCheck size={18} className="text-[hsl(var(--teal))]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-foreground">Secure Access</h2>
                            <p className="text-[12px] text-muted-foreground">Protected admin dashboard</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Password Field */}
                        <div className="mb-5">
                            <label className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    placeholder="Enter admin password"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-secondary border border-border text-[14px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--coral)/0.3)] focus:border-[hsl(var(--coral)/0.4)] transition-all"
                                    autoFocus
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] font-semibold text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full py-3.5 rounded-xl font-bold text-[14px] text-white gradient-coral transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{ boxShadow: "0 6px 20px -4px rgba(232, 96, 60, 0.4)" }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Lock size={14} />
                                    Access Dashboard
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[12px] text-muted-foreground/50 mt-6">
                    Secured access &middot; Snowie AI Platform
                </p>
            </div>
        </div>
    );
}
