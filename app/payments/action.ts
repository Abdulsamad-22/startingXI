"use server";

import { createClient } from "@/lib/supabase/server";
import { FEATURE_PRICES, type PaidFeature } from "@/lib/payments/pricing";

export async function initializePayment(feature: PaidFeature, email: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const amount = FEATURE_PRICES[feature];

  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      feature,
      amount,
      paystack_reference: crypto.randomUUID(),
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount,
      reference: payment.paystack_reference,
    }),
  });

  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Failed to start payment");

  return {
    accessCode: json.data.access_code,
    reference: payment.paystack_reference,
  };
}

export async function verifyPayment(reference: string) {
  const supabase = await createClient();

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    },
  );
  const json = await res.json();

  if (json.status && json.data.status === "success") {
    await supabase
      .from("payments")
      .update({
        status: "success",
        authorization_code: json.data.authorization?.reusable
          ? json.data.authorization.authorization_code
          : null,
      })
      .eq("paystack_reference", reference);
    return { success: true };
  }

  return { success: false };
}

export async function hasSavedCard(): Promise<{
  available: boolean;
  email?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { available: false };

  const { data } = await supabase
    .from("payments")
    .select("authorization_code, email")
    .eq("user_id", user.id)
    .eq("status", "success")
    .not("authorization_code", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data
    ? { available: true, email: data.email ?? undefined }
    : { available: false };
}

export async function chargeWithSavedCard(feature: PaidFeature) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: lastSuccess } = await supabase
    .from("payments")
    .select("authorization_code, email")
    .eq("user_id", user.id)
    .eq("status", "success")
    .not("authorization_code", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!lastSuccess?.authorization_code)
    throw new Error("No saved card on file");

  const amount = FEATURE_PRICES[feature];
  const reference = crypto.randomUUID();

  const { error: insertError } = await supabase.from("payments").insert({
    user_id: user.id,
    feature,
    amount,
    email: lastSuccess.email,
    paystack_reference: reference,
    status: "pending",
  });
  if (insertError) throw insertError;

  const res = await fetch(
    "https://api.paystack.co/transaction/charge_authorization",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: lastSuccess.email,
        amount,
        authorization_code: lastSuccess.authorization_code,
        reference,
      }),
    },
  );

  const json = await res.json();
  if (!json.status || json.data.status !== "success") {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("paystack_reference", reference);
    throw new Error("Saved card payment failed — try a new card instead");
  }

  await supabase
    .from("payments")
    .update({
      status: "success",
      authorization_code: lastSuccess.authorization_code,
    })
    .eq("paystack_reference", reference);
  return { success: true };
}

export async function hasUnusedAccess(feature: PaidFeature): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("payments")
    .select("id")
    .eq("user_id", user.id)
    .eq("feature", feature)
    .eq("status", "success")
    .is("used_at", null)
    .limit(1)
    .maybeSingle();

  return !!data;
}

export async function consumeAccess(feature: PaidFeature) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: payment } = await supabase
    .from("payments")
    .select("id")
    .eq("user_id", user.id)
    .eq("feature", feature)
    .eq("status", "success")
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!payment) throw new Error("No unused access found for this feature");

  await supabase
    .from("payments")
    .update({ used_at: new Date().toISOString() })
    .eq("id", payment.id);
}
