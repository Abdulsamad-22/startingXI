import { renderMediaOnLambda } from "@remotion/lambda/client";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Find one unused successful video payment.
  const { data: availablePayment, error: findError } = await supabase
    .from("payments")
    .select("id")
    .eq("user_id", user.id)
    .eq("feature", "video_export")
    .eq("status", "success")
    .is("used_at", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (findError) {
    return NextResponse.json(
      { error: "Could not verify video access" },
      { status: 500 },
    );
  }

  if (!availablePayment) {
    return NextResponse.json(
      { error: "Payment required", code: "PAYMENT_REQUIRED" },
      { status: 402 },
    );
  }

  // Claim it with an extra used_at=null condition.
  // If two requests arrive together, only one can claim this payment.
  const { data: claimedPayment, error: claimError } = await supabase
    .from("payments")
    .update({ used_at: new Date().toISOString() })
    .eq("id", availablePayment.id)
    .eq("user_id", user.id)
    .is("used_at", null)
    .select("id")
    .maybeSingle();

  if (claimError || !claimedPayment) {
    return NextResponse.json(
      { error: "This video access has already been used" },
      { status: 409 },
    );
  }

  try {
    const body = await req.json();

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: "us-east-1",
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      serveUrl: process.env.REMOTION_SERVE_URL!,
      composition: "LineupReveal",
      inputProps: body,
      codec: "h264",
      concurrency: 1,
    });

    return NextResponse.json({
      renderId,
      bucketName,
      sizePreset: body.sizePreset,
    });
  } catch (error) {
    // Lambda did not start, so return the paid video credit.
    await supabase
      .from("payments")
      .update({ used_at: null })
      .eq("id", claimedPayment.id)
      .eq("user_id", user.id);

    console.error("Could not start video render:", error);

    return NextResponse.json(
      {
        error:
          "Could not start the video render. Your video credit was restored.",
      },
      { status: 500 },
    );
  }
}
