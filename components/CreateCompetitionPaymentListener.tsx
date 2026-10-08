"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createCompetitionPaid } from "@/app/competitions/actions";
// import { PaymentCelebration } from './PaymentCelebration'

export function CreateCompetitionPaymentListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const reference = searchParams.get("reference");

    if (paymentStatus === "cancelled") {
      localStorage.removeItem("pending-competition");
      router.replace(pathname);
      return;
    }

    if (paymentStatus !== "success" || !reference) return;

    setCelebrationOpen(true);
    router.replace(pathname);

    let attempts = 0;
    // const check = setInterval(async () => {
    //   attempts++
    //   const result = await verifyPayment(reference)
    //   if (result.success) {
    //     clearInterval(check)
    //     setVerified(true)
    //   } else if (attempts >= 15) {
    //     clearInterval(check)
    //     setCelebrationOpen(false)
    //   }
    // }, 1000)

    // return () => clearInterval(check)
  }, []);

  async function handleCelebrationClose() {
    setCelebrationOpen(false);
    setVerified(false);

    const pendingRaw = localStorage.getItem("pending-competition");
    if (!pendingRaw) return;
    localStorage.removeItem("pending-competition");

    const pending = JSON.parse(pendingRaw);
    const formData = new FormData();
    Object.entries(pending).forEach(([key, value]) =>
      formData.set(key, value as string),
    );

    try {
      const id = await createCompetitionPaid(formData);
      router.push(`/competitions/${id}`);
    } catch (err) {
      console.error("Failed to create competition after payment:", err);
    }
  }

  if (!celebrationOpen) return null;
  // return <PaymentCelebration verified={verified} onClose={handleCelebrationClose} />
}
