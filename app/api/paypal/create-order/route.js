

import { NextResponse } from "next/server";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  
  return data.access_token;
}

export async function POST(req) {
  const { amount } = await req.json();

  const safeAmount = Math.max(1, parseFloat(amount) || 1).toFixed(2);

  const accessToken = await getAccessToken();
  

  if (!accessToken) {
    return NextResponse.json(
      { error: "Failed to get PayPal access token" },
      { status: 500 }
    );
  }

  const orderRes = await fetch(
    "https://api-m.paypal.com/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: safeAmount,
            },
          },
        ],
      }),
    }
  );

  const data = await orderRes.json();

  if (!orderRes.ok) {
    console.error("PayPal order error:", data);

    return NextResponse.json(
      {
        error: "PayPal order creation failed",
        details: data,
      },
      { status: 500 }
    );
  }

  if (!data?.id) {
    return NextResponse.json(
      {
        error: "No order ID returned",
        data,
      },
      { status: 500 }
    );
  }
  

  return NextResponse.json({ id: data.id });
}