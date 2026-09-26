import { getRenderProgress } from "@remotion/lambda/client";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const renderId = searchParams.get("renderId")!;
  const bucketName = searchParams.get("bucketName")!;
  const teamId = searchParams.get("teamId")!;
  const sizePreset = searchParams.get("sizePreset")!;

  const progress = await getRenderProgress({
    renderId,
    bucketName,
    functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
    region: "us-east-1",
  });

  if (progress.fatalErrorEncountered) {
    return NextResponse.json(
      { error: progress.errors[0]?.message ?? "Render failed" },
      { status: 500 },
    );
  }

  if (!progress.done) {
    return NextResponse.json({ done: false });
  }

  const fileRes = await fetch(progress.outputFile!);
  const fileBuffer = Buffer.from(await fileRes.arrayBuffer());

  const supabase = await createClient();
  const uploadPath = `${teamId}/reveal-${sizePreset}-${Date.now()}.mp4`;
  const { data: uploaded, error } = await supabase.storage
    .from("exports")
    .upload(uploadPath, fileBuffer, { contentType: "video/mp4" });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("exports").getPublicUrl(uploaded.path);
  return NextResponse.json({ done: true, url: publicUrl });
}
