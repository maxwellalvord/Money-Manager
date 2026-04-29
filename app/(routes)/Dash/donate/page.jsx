'use client';

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { AiFillLinkedin } from 'react-icons/ai'
import { AiFillInstagram } from 'react-icons/ai'
import { AiFillTwitterCircle } from 'react-icons/ai'

export default function Page() {
    const [tier, setTier] = useState("5");


    const tiers = ["1", "5", "10"];

    const isValidTier = ["1", "5", "10"].includes(tier);

    return (
        <div className="flex flex-col items-center gap-6 mt-6">
            <h2 className="text-3xl font-semibold bg-blue-300 text-white p-4 rounded-lg w-2/3 text-center shadow-md">
                Enjoying Budgeting and want to support future project development?
            </h2>


            <div className="flex gap-3">
                {tiers.map((val) => (
                    <button
                        key={val}
                        onClick={() => {
                            setTier(val);
                        }}
                        className={`px-4 py-2 rounded-lg border ${tier === val
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                            }`}
                    >
                        ${parseFloat(val)}
                    </button>
                ))}

            </div>




            {!isValidTier && (
                <p className="text-red-500 text-sm">
                    Minimum donation is $1
                </p>
            )}

            <div className={`w-80 ${!isValidTier ? "opacity-50 pointer-events-none" : ""}`}>
                <PayPalScriptProvider
                    options={{
                        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                        currency: "USD",
                        components: "buttons",
                        "enable-funding": "venmo",
                    }}
                >
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        forceReRender={[tier]}

                        createOrder={async () => {
                            if (!isValidTier) {
                                alert("Minimum donation is $1");
                                return;
                            }

                            const res = await fetch("/api/paypal/create-order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ tier }),
                            });

                            const order = await res.json();
                            return order.id;
                        }}

                        onApprove={async (data) => {
                            const res = await fetch("/api/paypal/verify-order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    orderID: data.orderID,
                                }),
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
            <div className="fixed bottom-0 left-0 w-full flex justify-center">
                <div className="ml-auto flex flex-col items-center justify-center py-4 px-6 bg-white w-[calc(100%-260px)]">

                    <div className="mb-3 flex gap-6 text-2xl justify-center">
                        <a href="https://www.linkedin.com/in/maxwellalvord/"><AiFillLinkedin /></a>
                        <a href="https://www.instagram.com/max_alvord/"><AiFillInstagram /></a>
                        <a href="https://twitter.com/AlvordMax"><AiFillTwitterCircle /></a>
                    </div>

                    <div className="text-center">
                        <small>&copy; Maxwell Alvord. All rights reserved.</small>
                    </div>

                </div>
            </div>
            <a
                href="https://github.com/maxwellalvord/React-Portfolio/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200 active:scale-95"
            >
                🐞 Report an Issue
            </a>
        </div>
    );
}