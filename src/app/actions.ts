"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const inquirySchema = z.object({
  product_id: z.string().uuid().optional().or(z.literal("")),
  product_sku: z.string().max(80).optional(),
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  company: z.string().max(180).optional(),
  country: z.string().max(120).optional(),
  phone: z.string().max(80).optional(),
  message: z.string().min(10).max(3000),
  redirect_to: z.string().startsWith("/").default("/en/contact"),
});

export async function submitInquiry(formData: FormData) {
  const parsed = inquirySchema.safeParse({
    product_id: formData.get("product_id")?.toString() || "",
    product_sku: formData.get("product_sku")?.toString() || "",
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    company: formData.get("company")?.toString() || "",
    country: formData.get("country")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    message: formData.get("message")?.toString() || "",
    redirect_to: formData.get("redirect_to")?.toString() || "/en/contact",
  });

  if (!parsed.success) {
    redirect(`${formData.get("redirect_to") || "/en/contact"}?error=1`);
  }

  const values = parsed.data;

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("inquiries").insert({
      product_id: values.product_id || null,
      product_sku: values.product_sku || null,
      name: values.name,
      email: values.email,
      company: values.company || null,
      country: values.country || null,
      phone: values.phone || null,
      message: values.message,
      status: "new",
    });

    if (error) {
      console.error("Failed to submit inquiry", error);
      redirect(`${values.redirect_to}?error=1`);
    }
  }

  redirect(`${values.redirect_to}?sent=1`);
}
