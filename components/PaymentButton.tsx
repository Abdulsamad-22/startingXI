"use client";

import { useState } from "react";
import { initializePayment, verifyPayment } from "@/app/payments/action";
import { loadPaystackScript } from "@/lib/payments/loadPaystackScript";
import {
  FEATURE_LABELS,
  FEATURE_PRICES,
  type PaidFeature,
} from "@/lib/payments/pricing";
import { Lock } from "lucide-react";

export function PaymentButton({
  feature,
  email,
  onSuccess,
}: {
  feature: PaidFeature;
  email: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
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
          } else {
            setError("Payment could not be confirmed — please try again");
          }
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed to start");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="text-xs bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-full px-3 py-1.5 disabled:opacity-50"
      >
        {loading ? (
          "Processing..."
        ) : (
          <span className="flex gap-1">
            <Lock size={16} />
            `Unlock — ₦${(FEATURE_PRICES[feature] / 100).toLocaleString()}`
          </span>
        )}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
