import { cache } from "react";

import { mockCategories, mockProducts, mockSiteSettings } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  Category,
  InquiryWithProduct,
  ProductWithRelations,
  SiteSettings,
} from "@/lib/types";

function sortProductImages(product: ProductWithRelations) {
  return {
    ...product,
    images: [...(product.images || [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  };
}

export const getAdminSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured()) return mockSiteSettings;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error("Failed to load admin settings", error);
    return mockSiteSettings;
  }

  return data;
});

export const getAdminCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured()) return mockCategories;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load admin categories", error);
    return [];
  }

  return data;
});

export const getAdminProducts = cache(
  async (): Promise<ProductWithRelations[]> => {
    if (!isSupabaseConfigured()) return mockProducts.map(sortProductImages);

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Failed to load admin products", error);
      return [];
    }

    return (data as unknown as ProductWithRelations[]).map(sortProductImages);
  },
);

export const getAdminProduct = cache(
  async (id: string): Promise<ProductWithRelations | null> => {
    if (!isSupabaseConfigured()) {
      return mockProducts.find((product) => product.id === id) ?? null;
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("Failed to load admin product", error);
      return null;
    }

    return sortProductImages(data as unknown as ProductWithRelations);
  },
);

export const getAdminInquiries = cache(
  async (): Promise<InquiryWithProduct[]> => {
    if (!isSupabaseConfigured()) return [];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("inquiries")
      .select("*, product:products(id, sku, name_en, name_ru, slug)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Failed to load admin inquiries", error);
      return [];
    }

    return data as unknown as InquiryWithProduct[];
  },
);
