"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { initializePayment } from "@/app/payments/action";
import {
  FEATURE_LABELS,
  FEATURE_PRICES,
  type PaidFeature,
} from "@/lib/payments/pricing";

export function PaymentGate({
  feature,
  open,
  onOpenChange,
}: {
  feature: PaidFeature;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const paymentId = crypto.randomUUID();
      const basePath = window.location.pathname;
      const existingParams = new URLSearchParams(window.location.search);

      existingParams.set("payment", "success");
      existingParams.set("reference", paymentId);
      existingParams.set("feature", feature);
      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}${basePath}?${existingParams.toString()}`;

      const cancelParams = new URLSearchParams(window.location.search);
      cancelParams.set("payment", "cancelled");
      const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}${basePath}?${cancelParams.toString()}`;

      const { checkoutUrl } = await initializePayment({
        feature,
        email,
        name: email,
        paymentId,
        successUrl,
        cancelUrl,
      });

      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed to start");
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#555958] rounded-xl p-6 w-full max-w-sm z-50">
          <h2 className="text-white text-lg font-bold mb-1">
            {FEATURE_LABELS[feature]}
          </h2>
          <p className="text-sm text-white/50 mb-4">
            ₦{FEATURE_PRICES[feature].toLocaleString()} — one-time unlock
          </p>

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

          <form onSubmit={handleContinue} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">
                Enter your email to receive your payment receipt.
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#0A1A14] text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-1 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
