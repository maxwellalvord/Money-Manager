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
  const { orderID } = await req.json();

  const accessToken = await getAccessToken();

  const res = await fetch(
    `https://api-m.paypal.com/v2/checkout/orders/${orderID}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const order = await res.json();

  if (order.status === "COMPLETED") {
    return NextResponse.json({
      status: "COMPLETED",
      id: order.id,
    });
  }

  return NextResponse.json({
    status: "FAILED",
  });
}