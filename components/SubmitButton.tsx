"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Creating..." : children}
    </button>
  );
}
