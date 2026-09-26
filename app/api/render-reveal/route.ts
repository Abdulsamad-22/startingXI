// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { exec } from "child_process";
// import { promisify } from "util";
// import { writeFile, readFile, unlink } from "fs/promises";
// import path from "path";

// const execAsync = promisify(exec);

// export const runtime = "nodejs";
// export const maxDuration = 60;

// export async function POST(req: NextRequest) {
//   const {
//     teamId,
//     teamName,
//     formationName,
//     primaryColor,
//     pitchPattern,
//     pitchBgColor,
//     pitchStripeColor,
//     pitchLineColor,
//     sizePreset,
//     players,
//   } = await req.json();

//   const propsPath = path.join("/tmp", `${teamId}-${sizePreset}-props.json`);
//   const outputPath = path.join("/tmp", `${teamId}-${sizePreset}-reveal.mp4`);

//   await writeFile(
//     propsPath,
//     JSON.stringify({
//       teamName,
//       formationName,
//       primaryColor,
//       pitchPattern,
//       pitchBgColor,
//       pitchStripeColor,
//       pitchLineColor,
//       sizePreset,
//       players,
//     }),
//   );

//   const entryPoint = path.join(process.cwd(), "remotion", "index.ts");

//   try {
//     const { stdout, stderr } = await execAsync(
//       `npx remotion render "${entryPoint}" LineupReveal "${outputPath}" --props="${propsPath}"`,
//     );
//     console.log("REMOTION STDOUT:", stdout);
//     console.log("REMOTION STDERR:", stderr);
//   } catch (err) {
//     console.error("Remotion render failed:", err);
//     return NextResponse.json({ error: "Render failed" }, { status: 500 });
//   }

//   const fileBuffer = await readFile(outputPath);
//   const supabase = await createClient();
//   const uploadPath = `${teamId}/reveal-${sizePreset}-${Date.now()}.mp4`;

//   const { data: uploaded, error } = await supabase.storage
//     .from("exports")
//     .upload(uploadPath, fileBuffer, { contentType: "video/mp4" });

//   await unlink(outputPath).catch(() => {});
//   await unlink(propsPath).catch(() => {});

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 500 });

//   const {
//     data: { publicUrl },
//   } = supabase.storage.from("exports").getPublicUrl(uploaded.path);
//   return NextResponse.json({ url: publicUrl });
// }

// app/api/render-reveal/route.ts
import {
  renderMediaOnLambda,
  getRenderProgress,
} from "@remotion/lambda/client";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  let done = false;
  let outputUrl: string | null = null;

  while (!done) {
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      region: "us-east-1",
    });

    if (progress.done) {
      done = true;
      outputUrl = progress.outputFile;
    } else if (progress.fatalErrorEncountered) {
      return NextResponse.json(
        { error: progress.errors[0]?.message ?? "Render failed" },
        { status: 500 },
      );
    } else {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  const fileRes = await fetch(outputUrl!);
  const fileBuffer = Buffer.from(await fileRes.arrayBuffer());

  const supabase = await createClient();
  const uploadPath = `${body.teamId}/reveal-${body.sizePreset}-${Date.now()}.mp4`;
  const { data: uploaded, error } = await supabase.storage
    .from("exports")
    .upload(uploadPath, fileBuffer, { contentType: "video/mp4" });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("exports").getPublicUrl(uploaded.path);
  return NextResponse.json({ url: publicUrl });
}
