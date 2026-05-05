'use client';

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { AiFillLinkedin, AiFillInstagram, AiFillTwitterCircle } from 'react-icons/ai';

const GLOBE_PATH =
    "M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q-.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1";

export default function Page() {
    const [tier, setTier] = useState("5");

    const tiers = ["1", "5", "10"];
    const isValidTier = tiers.includes(tier);

    return (
        <div className="min-h-screen pb-28">
            <div className="max-w-xl mx-auto px-4 py-8 flex flex-col items-center gap-6">

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-blue-400 to-blue-500 text-white p-5 rounded-2xl w-full text-center shadow-md leading-snug">
                    Enjoying the app? Support future development!
                </h2>

                {/* Donation card */}
                <div className="w-full border rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <p className="text-center text-muted-foreground text-sm">Choose an amount to donate</p>

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
                        <PayPalScriptProvider
                            options={{
                                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                                currency: "USD",
                                components: "buttons"
                            }}
                        >
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

                {/* Report issue */}
                <a
                    href="https://github.com/maxwellalvord/React-Portfolio/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                    🐞 Report an Issue
                </a>

                {/* Portfolio button */}
                <a
                    href="https://maxwellalvord.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-btn"
                >
                    <span className="p-btn__shimmer" />
                    <span className="p-btn__icon">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d={GLOBE_PATH} fill="#534AB7" />
                        </svg>
                    </span>
                    <span>Visit my portfolio to see more!</span>
                </a>

            </div>

            {/* Footer — full width on mobile, offset by sidebar on desktop */}
            <div className="fixed bottom-0 left-0 w-full md:ml-64 md:w-[calc(100%-256px)] bg-background border-t">
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
          padding: 15px 30px;
          background: #CECBF6;
          border: 1.5px solid #AFA9EC;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 500;
          color: #26215C;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          animation: float 3s ease-in-out infinite, pulse-ring 2.8s ease-out infinite;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
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
