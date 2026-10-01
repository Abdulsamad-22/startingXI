"use client";

import { useState } from "react";
import { PaymentGate } from "./PaymentGate";
import type { PaidFeature } from "@/lib/payments/pricing";

export function PaymentButton({
  feature,
  label = "Unlock",
}: {
  feature: PaidFeature;
  onSuccess: () => void;
  label?: string;
}) {
  const [gateOpen, setGateOpen] = useState(false);
  const [gateFeature, setGateFeature] = useState<PaidFeature | null>(null);

  return (
    <>
      <button
        onClick={() => setGateOpen(true)}
        className="text-xs bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-full px-3 py-1.5"
      >
        {label}
      </button>
      <PaymentGate
        feature={feature}
        open={gateOpen}
        onOpenChange={setGateOpen}
      />
    </>
  );
}
