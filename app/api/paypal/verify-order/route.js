"use server";

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
  const { orderID } = await req.json();

  const accessToken = await getAccessToken();

 const captureRes = await fetch(
    `https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const capture = await captureRes.json();

  if (capture.status === "COMPLETED") {
    return NextResponse.json({
      status: "COMPLETED",
      id: capture.id,
    });
  }

  return NextResponse.json({
    status: "FAILED",
    details: capture,
  });
}