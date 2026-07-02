"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { inquiryStatuses, InquiryStatus, ProductStatus } from "@/lib/types";

export type ActionState = {
  message?: string;
  ok?: boolean;
};

function value(formData: FormData, name: string) {
  return formData.get(name)?.toString().trim() || "";
}

function nullable(formData: FormData, name: string) {
  const current = value(formData, name);
  return current ? current : null;
}

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function numberValue(formData: FormData, name: string, fallback = 100) {
  const parsed = Number(value(formData, name));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function requireAdminClient() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?setup=1");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!user || !isAdmin) {
    redirect("/admin/login");
  }

  return supabase;
}

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { message: "请先配置 Supabase 环境变量。", ok: false };
  }

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const parsed = schema.safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
  });

  if (!parsed.success) {
    return { message: "请输入正确的邮箱和密码。", ok: false };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { message: "登录失败，请检查账号密码。", ok: false };
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    await supabase.auth.signOut();
    return {
      message: "该账号尚未加入 admin_profiles，不能进入后台。",
      ok: false,
    };
  }

  redirect("/admin");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

export async function updatePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = value(formData, "password");
  const confirmPassword = value(formData, "confirm_password");

  if (password.length < 8) {
    return { message: "新密码至少需要 8 位。", ok: false };
  }

  if (password !== confirmPassword) {
    return { message: "两次输入的新密码不一致。", ok: false };
  }

  const supabase = await requireAdminClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { message: `密码修改失败：${error.message}`, ok: false };
  }

  return { message: "密码已更新。", ok: true };
}

export async function saveSettingsAction(formData: FormData) {
  const supabase = await requireAdminClient();
  let socials = {};

  try {
    socials = value(formData, "socials")
      ? JSON.parse(value(formData, "socials"))
      : {};
  } catch {
    redirectWithError("/admin/settings", "社媒链接 JSON 格式不正确");
  }

  const id = value(formData, "id");
  const payload = {
    company_name: value(formData, "company_name"),
    logo_url: nullable(formData, "logo_url"),
    hero_title_en: value(formData, "hero_title_en"),
    hero_title_ru: nullable(formData, "hero_title_ru"),
    hero_subtitle_en: value(formData, "hero_subtitle_en"),
    hero_subtitle_ru: nullable(formData, "hero_subtitle_ru"),
    about_title_en: value(formData, "about_title_en"),
    about_title_ru: nullable(formData, "about_title_ru"),
    about_body_en: value(formData, "about_body_en"),
    about_body_ru: nullable(formData, "about_body_ru"),
    contact_email: value(formData, "contact_email"),
    contact_phone: nullable(formData, "contact_phone"),
    contact_address_en: nullable(formData, "contact_address_en"),
    contact_address_ru: nullable(formData, "contact_address_ru"),
    footer_tagline_en: nullable(formData, "footer_tagline_en"),
    footer_tagline_ru: nullable(formData, "footer_tagline_ru"),
    socials,
  };

  const request = id
    ? supabase.from("site_settings").update(payload).eq("id", id)
    : supabase.from("site_settings").insert(payload);
  const { error } = await request;

  if (error) {
    redirectWithError("/admin/settings", error.message);
  }

  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}

export async function saveCategoryAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = value(formData, "id");
  const payload = {
    slug: value(formData, "slug"),
    name_en: value(formData, "name_en"),
    name_ru: nullable(formData, "name_ru"),
    description_en: nullable(formData, "description_en"),
    description_ru: nullable(formData, "description_ru"),
    sort_order: numberValue(formData, "sort_order"),
    is_active: checkbox(formData, "is_active"),
  };

  const request = id
    ? supabase.from("categories").update(payload).eq("id", id)
    : supabase.from("categories").insert(payload);
  const { error } = await request;

  if (error) {
    redirectWithError("/admin/categories", error.message);
  }

  revalidatePath("/");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", value(formData, "id"));

  if (error) {
    redirectWithError("/admin/categories", error.message);
  }

  revalidatePath("/");
  redirect("/admin/categories?deleted=1");
}

export async function saveProductAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const id = value(formData, "id");
  const status = value(formData, "status") as ProductStatus;
  const normalizedStatus: ProductStatus =
    status === "published" ? "published" : "draft";
  let specs = {};

  try {
    specs = value(formData, "specs") ? JSON.parse(value(formData, "specs")) : {};
  } catch {
    redirectWithError(
      id ? `/admin/products/${id}` : "/admin/products/new",
      "规格参数 JSON 格式不正确",
    );
  }

  const payload = {
    category_id: nullable(formData, "category_id"),
    sku: value(formData, "sku"),
    slug: value(formData, "slug"),
    name_en: value(formData, "name_en"),
    name_ru: nullable(formData, "name_ru"),
    summary_en: nullable(formData, "summary_en"),
    summary_ru: nullable(formData, "summary_ru"),
    description_en: nullable(formData, "description_en"),
    description_ru: nullable(formData, "description_ru"),
    specs,
    status: normalizedStatus,
    is_featured: checkbox(formData, "is_featured"),
    sort_order: numberValue(formData, "sort_order"),
  };

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);

    if (error) redirectWithError(`/admin/products/${id}`, error.message);

    revalidatePath("/");
    redirect(`/admin/products/${id}?saved=1`);
  }

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    redirectWithError("/admin/products/new", error?.message || "产品创建失败");
  }

  revalidatePath("/");
  redirect(`/admin/products/${data.id}?created=1`);
}

export async function deleteProductAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", value(formData, "id"));

  if (error) {
    redirectWithError("/admin/products", error.message);
  }

  revalidatePath("/");
  redirect("/admin/products?deleted=1");
}

export async function saveInquiryAction(formData: FormData) {
  const supabase = await requireAdminClient();
  const status = value(formData, "status");

  if (!inquiryStatuses.includes(status as (typeof inquiryStatuses)[number])) {
    redirectWithError("/admin/inquiries", "询盘状态不正确");
  }
  const nextStatus = status as InquiryStatus;

  const { error } = await supabase
    .from("inquiries")
    .update({
      status: nextStatus,
      admin_note: nullable(formData, "admin_note"),
    })
    .eq("id", value(formData, "id"));

  if (error) {
    redirectWithError("/admin/inquiries", error.message);
  }

  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries?saved=1");
}
