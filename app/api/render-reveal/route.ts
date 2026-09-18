import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, readFile, unlink } from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const {
    teamId,
    teamName,
    formationName,
    primaryColor,
    pitchPattern,
    pitchBgColor,
    pitchStripeColor,
    pitchLineColor,
    sizePreset,
    players,
  } = await req.json();

  const propsPath = path.join("/tmp", `${teamId}-${sizePreset}-props.json`);
  const outputPath = path.join("/tmp", `${teamId}-${sizePreset}-reveal.mp4`);

  await writeFile(
    propsPath,
    JSON.stringify({
      teamName,
      formationName,
      primaryColor,
      pitchPattern,
      pitchBgColor,
      pitchStripeColor,
      pitchLineColor,
      sizePreset,
      players,
    }),
  );

  const entryPoint = path.join(process.cwd(), "remotion", "index.ts");

  try {
    const { stdout, stderr } = await execAsync(
      `npx remotion render "${entryPoint}" LineupReveal "${outputPath}" --props="${propsPath}"`,
    );
    console.log("REMOTION STDOUT:", stdout);
    console.log("REMOTION STDERR:", stderr);
  } catch (err) {
    console.error("Remotion render failed:", err);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }

  const fileBuffer = await readFile(outputPath);
  const supabase = await createClient();
  const uploadPath = `${teamId}/reveal-${sizePreset}-${Date.now()}.mp4`;

  const { data: uploaded, error } = await supabase.storage
    .from("exports")
    .upload(uploadPath, fileBuffer, { contentType: "video/mp4" });

  await unlink(outputPath).catch(() => {});
  await unlink(propsPath).catch(() => {});

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("exports").getPublicUrl(uploaded.path);
  return NextResponse.json({ url: publicUrl });
}
