import { renderMediaOnLambda } from "@remotion/lambda/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
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
    teamId: body.teamId,
    sizePreset: body.sizePreset,
  });
}
