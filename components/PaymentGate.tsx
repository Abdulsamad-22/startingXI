"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  initializePayment,
  verifyPayment,
  chargeWithSavedCard,
  hasSavedCard,
} from "@/app/payments/action";
import { loadPaystackScript } from "@/lib/payments/loadPaystackScript";
import {
  FEATURE_LABELS,
  FEATURE_PRICES,
  type PaidFeature,
} from "@/lib/payments/pricing";

export function PaymentGate({
  feature,
  open,
  onOpenChange,
  onSuccess,
}: {
  feature: PaidFeature;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCard, setSavedCard] = useState<{
    available: boolean;
    email?: string;
  } | null>(null);
  const [useNewCard, setUseNewCard] = useState(false);

  useEffect(() => {
    if (open) hasSavedCard().then(setSavedCard);
  }, [open]);

  async function handleUseSavedCard() {
    setLoading(true);
    setError(null);
    try {
      await chargeWithSavedCard(feature);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Saved card payment failed",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { accessCode, reference } = await initializePayment(feature, email);
      await loadPaystackScript();

      const popup = new (window as any).PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: async () => {
          const result = await verifyPayment(reference);
          if (result.success) {
            onSuccess();
            onOpenChange(false);
          } else {
            setError("Payment could not be confirmed — try again");
          }
          setLoading(false);
        },
        onCancel: () => setLoading(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed to start");
      setLoading(false);
    }
  }

  const showSavedCardOption = savedCard?.available && !useNewCard;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#555958] rounded-xl p-6 w-full max-w-sm z-50">
          <h2 className="text-lg text-[#fff] font-bold mb-1">
            {FEATURE_LABELS[feature]}
          </h2>
          <p className="text-sm text-white/50 mb-4">
            ₦{(FEATURE_PRICES[feature] / 100).toLocaleString()} — one-time
            unlock
          </p>

          {showSavedCardOption ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleUseSavedCard}
                disabled={loading}
                className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 disabled:opacity-50"
              >
                {loading ? "Processing..." : `Pay with saved card`}
              </button>
              <button
                type="button"
                onClick={() => setUseNewCard(true)}
                className="text-xs text-white/40 hover:text-white"
              >
                Use a different card instead
              </button>
            </div>
          ) : (
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
                  className="bg-[#0A1A14] text-[#fff] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-1 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Continue to Payment"}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
