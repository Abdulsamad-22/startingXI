import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/payments/admin";

export async function POST(req: NextRequest) {
  const body = await req.text();

  // X-Bachs-Signature-V2: t=TIMESTAMP,v1=SIGNATURE
  const signatureHeader = req.headers.get("x-bachs-signature-v2");

  console.log("BACHS WEBHOOK RECEIVED:", {
    hasSignature: !!signatureHeader,
    signatureHeader: signatureHeader
      ? `${signatureHeader.slice(0, 20)}...`
      : null,
    bodyPreview: body.slice(0, 300),
  });

  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing Bachs signature header" },
      { status: 401 },
    );
  }

  const parts = signatureHeader.split(",");

  let timestamp: string | undefined;
  const signatures: string[] = [];

  for (const part of parts) {
    const [key, ...valueParts] = part.split("=");

    if (!key || valueParts.length === 0) {
      continue;
    }

    const value = valueParts.join("=");

    if (key === "t") {
      timestamp = value;
    }

    if (key === "v1") {
      signatures.push(value);
    }
  }

  if (!timestamp || signatures.length === 0) {
    return NextResponse.json(
      { error: "Invalid Bachs signature header" },
      { status: 401 },
    );
  }

  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber)) {
    return NextResponse.json(
      { error: "Invalid Bachs timestamp" },
      { status: 401 },
    );
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (Math.abs(currentTime - timestampNumber) > 300) {
    return NextResponse.json(
      { error: "Stale Bachs webhook timestamp" },
      { status: 401 },
    );
  }

  const secret = process.env.BACHS_WEBHOOK_SECRET;

  if (!secret) {
    console.error("BACHS WEBHOOK: BACHS_WEBHOOK_SECRET is not configured");

    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 },
    );
  }

  const signedPayload = `${timestampNumber}.${body}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const isValid = signatures.some((signature) => {
    try {
      const expectedBuffer = Buffer.from(expectedSignature, "utf8");
      const receivedBuffer = Buffer.from(signature, "utf8");

      if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    } catch {
      return false;
    }
  });

  if (!isValid) {
    console.error("BACHS WEBHOOK: signature mismatch");

    return NextResponse.json(
      { error: "Invalid Bachs webhook signature" },
      { status: 401 },
    );
  }

  let event: any;

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  console.log("BACHS WEBHOOK EVENT:", {
    type: event.type,
    data: event.data,
  });

  if (event.type === "collection.succeeded") {
    const supabase = createAdminClient();

    const checkoutId =
      event.data?.checkout_id ?? event.data?.reference ?? event.data?.id;

    if (!checkoutId) {
      console.error(
        "BACHS WEBHOOK: Could not find payment reference",
        event.data,
      );

      return NextResponse.json(
        { error: "Missing payment reference" },
        { status: 400 },
      );
    }

    const { error, count } = await supabase
      .from("payments")
      .update({ status: "success" }, { count: "exact" })
      .eq("provider_reference", checkoutId);

    console.log("BACHS WEBHOOK: payment update result", {
      checkoutId,
      error,
      count,
    });

    if (error) {
      console.error("BACHS WEBHOOK: Supabase update failed", error);

      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    received: true,
  });
}
