import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const supabase = await createClient();
    await supabase
      .from("payments")
      .update({
        status: "success",
        authorization_code: event.data.authorization?.reusable
          ? event.data.authorization.authorization_code
          : null,
      })
      .eq("paystack_reference", event.data.reference);
  }

  return NextResponse.json({ received: true });
}
