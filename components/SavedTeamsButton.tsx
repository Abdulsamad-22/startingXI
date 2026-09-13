import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function SavedTeamsButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let count = 0;
  if (user) {
    const { count: teamCount } = await supabase
      .from("teams")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    count = teamCount ?? 0;
  }

  return (
    <Link
      href="/teams"
      className="relative flex items-center gap-2 bg-[#1D2A25] hover:bg-[#1D2A25]/70 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h6l2 2h8v12H4z" />
      </svg>
      My Teams
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-[#3CEFA1] text-[#0E2F21] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
