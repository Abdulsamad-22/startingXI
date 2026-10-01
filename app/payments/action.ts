"use server";

import { createClient } from "@/lib/supabase/server";
import {
  FEATURE_PRICES,
  FEATURE_PRODUCT_IDS,
  type PaidFeature,
} from "@/lib/payments/pricing";

export async function initializePayment({
  feature,
  email,
  name,
  paymentId,
  successUrl,
  cancelUrl,
}: {
  feature: PaidFeature;
  email: string;
  name?: string;
  paymentId?: string;
  successUrl?: string;
  cancelUrl?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const productId = FEATURE_PRODUCT_IDS[feature];
  if (!productId) throw new Error(`No product configured yet for "${feature}"`);

  const res = await fetch("https://api.bachs.io/v1/checkout-sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BACHS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          pricing: {
            price_type: "fixed",
            amount: String(FEATURE_PRICES[feature]),
          },
        },
      ],
      payment_method_types: ["USD_CARD", "NGN_BANK_TRANSFER"],
      customer: { email, name: name ?? email },
      success_url: successUrl,
      cancel_url: cancelUrl,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(
      errBody.message || `Failed to start payment (status ${res.status})`,
    );
  }

  const session = await res.json();

  const { error } = await supabase.from("payments").insert({
    id: paymentId,
    user_id: user.id,
    feature,
    amount: FEATURE_PRICES[feature],
    email,
    provider_reference: session.checkout_id,
    status: "pending",
  });
  if (error) throw error;

  return { checkoutUrl: session.checkout_url };
}

export async function verifyPayment(reference: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("status")
    .eq("id", reference)
    .single();
  return { success: data?.status === "success" };
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
