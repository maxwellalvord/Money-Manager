

import { NextResponse } from "next/server";
console.log("VERIFY ROUTE HIT");

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
  try {
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

    console.log("PAYPAL CAPTURE RESPONSE:", capture);

    if (!captureRes.ok) {
      return NextResponse.json(
        {
          status: "FAILED",
          error: capture,
        },
        { status: 400 }
      );
    }

    if (capture.status === "COMPLETED") {
      return NextResponse.json({
        status: "COMPLETED",
        id: capture.id,
      });
    }

    return NextResponse.json(
      {
        status: "FAILED",
        reason: capture.status,
        details: capture,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("CAPTURE ERROR:", err);

    return NextResponse.json(
      {
        status: "ERROR",
        message: err.message,
      },
      { status: 500 }
    );
    
  }
}