'use client';

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { AiFillLinkedin, AiFillInstagram, AiFillTwitterCircle } from 'react-icons/ai';
import { BarChart2, ShieldCheck, CalendarDays, Sparkles, Bug, Rocket, Code2, Star, CheckCircle2 } from 'lucide-react';

const GLOBE_PATH =
    "M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q-.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1";

const features = [
    { icon: BarChart2, label: 'Budget Tracking', desc: 'Visual charts and real-time spend tracking across all your budgets.' },
    { icon: ShieldCheck, label: 'Secure & Private', desc: 'Your data stays yours — authenticated and stored securely.' },
    { icon: CalendarDays, label: 'Monthly Cycles', desc: 'Automatic month-end resets with historical statement snapshots.' },
];

const roadmap = [
    { icon: Rocket, text: 'Recurring expense automation' },
    { icon: BarChart2, text: 'Spending trends & insights' },
    { icon: Star, text: 'Custom budget categories' },
    { icon: Code2, text: 'Mobile app version' },
];

const recentlyShipped = [
    'Savings goal tracking',
    'Month-end statements',
    'Budget calendar view',
    'Dark mode support',
    'Over-budget alerts',
    'Expense delete confirmation',
];

const techStack = [
    { name: 'Next.js 15', color: 'bg-black text-white dark:bg-white dark:text-black' },
    { name: 'Tailwind CSS', color: 'bg-cyan-500 text-white' },
    { name: 'shadcn/ui', color: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900' },
    { name: 'Recharts', color: 'bg-emerald-500 text-white' },
    { name: 'Drizzle ORM', color: 'bg-amber-400 text-amber-900' },
    { name: 'Neon DB', color: 'bg-green-600 text-white' },
    { name: 'Clerk Auth', color: 'bg-violet-600 text-white' },
    { name: 'PayPal SDK', color: 'bg-blue-700 text-white' },
    { name: 'React Icons', color: 'bg-pink-500 text-white' },
    { name: 'Radix UI', color: 'bg-indigo-500 text-white' },
];

export default function Page() {
    const [tier, setTier] = useState("5");
    const tiers = ["1", "5", "10"];
    const isValidTier = tiers.includes(tier);

    return (
        <div className="min-h-screen pb-56 relative overflow-hidden">

            {/* Decorative background blobs */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-32 left-1/4 w-72 h-72 rounded-full bg-blue-300/10 blur-3xl" />

            <div className="relative w-full px-4 sm:px-6 lg:px-10 py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

                    {/* ── LEFT PANEL (desktop only) ── */}
                    <aside className="hidden lg:flex flex-col gap-4 flex-1 pt-2 sticky top-8 min-w-0">

                        <div className="border rounded-2xl p-5 shadow-sm flex flex-col gap-4 bg-gradient-to-b from-background to-blue-50/40 dark:to-blue-950/10">
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    MA
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-[clamp(0.85rem,1.2vw,1.05rem)] truncate">Maxwell Alvord</p>
                                    <p className="text-[clamp(0.75rem,1vw,0.875rem)] text-muted-foreground">Solo developer</p>
                                </div>
                            </div>
                            <a href="https://maxwellalvord.dev" target="_blank" rel="noopener noreferrer"
                                className="text-[clamp(0.75rem,1vw,0.875rem)] text-blue-500 hover:underline">
                                maxwellalvord.dev
                            </a>
                            <div className="flex gap-4 text-[clamp(1.25rem,2vw,1.75rem)]">
                                <a href="https://www.linkedin.com/in/maxwellalvord/" className="hover:text-blue-600 transition-colors text-muted-foreground"><AiFillLinkedin /></a>
                                <a href="https://www.instagram.com/max_alvord/" className="hover:text-pink-500 transition-colors text-muted-foreground"><AiFillInstagram /></a>
                                <a href="https://twitter.com/AlvordMax" className="hover:text-sky-400 transition-colors text-muted-foreground"><AiFillTwitterCircle /></a>
                            </div>
                        </div>

                        <div className="border rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                            <p className="text-[clamp(0.65rem,0.9vw,0.8rem)] font-semibold uppercase tracking-widest text-muted-foreground">Built with</p>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map(({ name, color }) => (
                                    <span key={name} className={`text-[clamp(0.65rem,0.9vw,0.8rem)] font-semibold px-2.5 py-0.5 rounded-full ${color}`}>
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </aside>

                    {/* ── CENTER ── */}
                    <div className="flex flex-col items-center gap-6 w-full lg:max-w-xl lg:flex-shrink-0">

                        {/* Hero */}
                        <div className="w-full rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 sm:p-8 text-white shadow-lg flex flex-col items-center gap-3 text-center">
                            <div className="bg-white/20 rounded-full p-3">
                                <Sparkles className="h-7 w-7 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold leading-snug">Enjoying the app?</h2>
                            <p className="text-blue-100 text-sm sm:text-base max-w-sm">
                                This app is built and maintained solo. Your support helps keep it ad-free, fast, and full of new features.
                            </p>
                        </div>

                        {/* Feature grid — 1 col on mobile, 3 on sm+ */}
                        <div className="w-full">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3 text-center">What your support helps build</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {features.map(({ icon: Icon, label, desc }) => (
                                    <div key={label} className="border rounded-xl p-4 flex flex-col sm:items-center gap-2 sm:text-center shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                                            <div className="bg-blue-50 dark:bg-blue-950/40 rounded-full p-2 flex-shrink-0">
                                                <Icon className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <p className="text-sm font-semibold leading-tight">{label}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Donation card */}
                        <div className="w-full border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
                            <div className="text-center">
                                <p className="font-semibold text-base sm:text-lg">Choose a donation amount</p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Every bit helps — thank you!</p>
                            </div>

                            <div className="flex gap-3 justify-center">
                                {tiers.map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setTier(val)}
                                        className={`flex-1 py-3 rounded-xl border-2 font-semibold text-lg transition-all duration-150
                                            ${tier === val
                                                ? "bg-chart-3 text-white border-chart-3 shadow-md scale-105"
                                                : "bg-background border-border hover:border-chart-3 hover:text-chart-3"
                                            }`}
                                    >
                                        ${parseFloat(val)}
                                    </button>
                                ))}
                            </div>

                            {!isValidTier && (
                                <p className="text-red-500 text-sm text-center">Minimum donation is $1</p>
                            )}

                            <div className={`w-full rounded-xl overflow-hidden bg-white p-3 ${!isValidTier ? "opacity-50 pointer-events-none" : ""}`}>
                                <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency: "USD", components: "buttons" }}>
                                    <PayPalButtons
                                        style={{ layout: "vertical" }}
                                        forceReRender={[tier]}
                                        createOrder={async () => {
                                            if (!isValidTier) throw new Error("Invalid tier");
                                            const res = await fetch("/api/paypal/create-order", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ amount: parseFloat(tier) }),
                                            });
                                            if (!res.ok) throw new Error("Create order failed");
                                            const order = await res.json();
                                            if (!order?.id) throw new Error("Missing order ID");
                                            return order.id;
                                        }}
                                        onApprove={async (data) => {
                                            const res = await fetch("/api/paypal/verify-order", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ orderID: data.orderID }),
                                            });
                                            const result = await res.json();
                                            if (result.status === "COMPLETED") {
                                                toast("Thank you for your donation!");
                                            } else {
                                                toast.error("Payment verification failed");
                                            }
                                        }}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        </div>

                        <div className="w-full flex items-center gap-3 text-muted-foreground">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs">or</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <a
                            href="https://github.com/maxwellalvord/React-Portfolio/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-950/50 transition-all duration-200 active:scale-95"
                        >
                            <Bug className="h-4 w-4" />
                            Report an Issue
                        </a>

                        <a href="https://maxwellalvord.dev" target="_blank" rel="noopener noreferrer" className="p-btn">
                            <span className="p-btn__shimmer" />
                            <span className="p-btn__icon">
                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d={GLOBE_PATH} fill="#534AB7" />
                                </svg>
                            </span>
                            <span>Visit my portfolio to see more!</span>
                        </a>

                        {/* ── MOBILE-ONLY bottom cards ── */}
                        <div className="lg:hidden w-full flex flex-col gap-4 pt-2">

                            <div className="border rounded-2xl p-5 shadow-sm flex flex-col gap-3 bg-gradient-to-b from-background to-blue-50/40 dark:to-blue-950/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        MA
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Maxwell Alvord</p>
                                        <p className="text-xs text-muted-foreground">Solo developer</p>
                                    </div>
                                    <div className="flex gap-3 text-xl ml-auto">
                                        <a href="https://www.linkedin.com/in/maxwellalvord/" className="hover:text-blue-600 transition-colors text-muted-foreground"><AiFillLinkedin /></a>
                                        <a href="https://www.instagram.com/max_alvord/" className="hover:text-pink-500 transition-colors text-muted-foreground"><AiFillInstagram /></a>
                                        <a href="https://twitter.com/AlvordMax" className="hover:text-sky-400 transition-colors text-muted-foreground"><AiFillTwitterCircle /></a>
                                    </div>
                                </div>
                                <a href="https://maxwellalvord.dev" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">maxwellalvord.dev</a>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Built with</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {techStack.map(({ name, color }) => (
                                            <span key={name} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{name}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="border rounded-2xl p-4 shadow-sm flex flex-col gap-2 bg-gradient-to-b from-background to-emerald-50/30 dark:to-emerald-950/10">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recently shipped</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                        {recentlyShipped.map(item => (
                                            <div key={item} className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                <span className="text-xs text-muted-foreground truncate">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* ── RIGHT PANEL (desktop only) ── */}
                    <aside className="hidden lg:flex flex-col gap-4 flex-1 pt-2 sticky top-8 min-w-0">

                        <div className="border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Rocket className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                                <p className="text-[clamp(0.65rem,0.9vw,0.8rem)] font-semibold uppercase tracking-widest text-muted-foreground">Coming soon</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                {roadmap.map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-start gap-2.5">
                                        <div className="mt-0.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-md p-1 flex-shrink-0">
                                            <Icon className="h-3 w-3 text-indigo-500" />
                                        </div>
                                        <span className="text-[clamp(0.75rem,1.05vw,0.9rem)] text-muted-foreground leading-snug">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border rounded-2xl p-5 shadow-sm flex flex-col gap-4 bg-gradient-to-b from-background to-emerald-50/30 dark:to-emerald-950/10">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <p className="text-[clamp(0.65rem,0.9vw,0.8rem)] font-semibold uppercase tracking-widest text-muted-foreground">Recently shipped</p>
                            </div>
                            <div className="flex flex-col gap-2.5">
                                {recentlyShipped.map(item => (
                                    <div key={item} className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                        <span className="text-[clamp(0.75rem,1.05vw,0.9rem)] text-muted-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </aside>

                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 z-50 w-full md:ml-64 md:w-[calc(100%-256px)] bg-background border-t">
                <div className="flex flex-col items-center justify-center py-3 px-6 gap-2">
                    <div className="flex gap-5 text-2xl">
                        <a href="https://www.linkedin.com/in/maxwellalvord/" className="hover:text-blue-600 transition-colors"><AiFillLinkedin /></a>
                        <a href="https://www.instagram.com/max_alvord/" className="hover:text-pink-500 transition-colors"><AiFillInstagram /></a>
                        <a href="https://twitter.com/AlvordMax" className="hover:text-sky-400 transition-colors"><AiFillTwitterCircle /></a>
                    </div>
                    <small className="text-muted-foreground">&copy; Maxwell Alvord. All rights reserved.</small>
                </div>
            </div>

            <style>{`
        @keyframes shimmer {
          from { transform: translateX(-100%) skewX(-12deg); }
          to   { transform: translateX(250%)  skewX(-12deg); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0  0px rgba(83,74,183,.35); }
          70%  { box-shadow: 0 0 0 14px rgba(83,74,183,0);   }
          100% { box-shadow: 0 0 0  0px rgba(83,74,183,0);   }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-5px); }
        }
        .p-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: #CECBF6;
          border: 1.5px solid #AFA9EC;
          border-radius: 999px;
          font-size: clamp(13px, 1.2vw, 15px);
          font-weight: 500;
          color: #26215C;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          animation: float 3s ease-in-out infinite, pulse-ring 2.8s ease-out infinite;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          max-width: 100%;
          text-align: center;
        }
        .p-btn:hover  { background: #AFA9EC; border-color: #7F77DD; transform: translateY(-2px); }
        .p-btn:active { transform: scale(0.97); }
        .p-btn__shimmer {
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          animation: shimmer 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        .p-btn__icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid #534AB7;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
        </div>
    );
}
