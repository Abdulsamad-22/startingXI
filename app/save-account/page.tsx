"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SaveAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Converts the current anonymous user into a permanent one —
    // same user id, so all existing teams/players stay attached.
    const { error } = await supabase.auth.updateUser({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleGoogleLink() {
    await supabase.auth.linkIdentity({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-[#555958] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Save your team</h1>
        <p className="text-white/50 text-sm text-center mb-6">
          Your teams and lineups stay exactly as they are — this just makes sure
          you don't lose them.
        </p>

        <button
          onClick={handleGoogleLink}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white text-[#0E2F21] font-semibold rounded-lg py-3 mb-4 hover:opacity-90"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-white/40">or</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#1D2A25] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#1D2A25] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save my team"}
          </button>
        </form>
      </div>
    </div>
  );
}
