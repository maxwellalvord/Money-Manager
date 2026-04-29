import { NextResponse } from "next/server";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
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

  const safeAmount = Math.max(1, Number(amount) || 1).toFixed(2);

  const accessToken = await getAccessToken();

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

  const order = await orderRes.json();

  return NextResponse.json(order);
}