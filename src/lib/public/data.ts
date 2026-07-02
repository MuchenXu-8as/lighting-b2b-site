import { cache } from "react";

import { localize } from "@/lib/i18n";
import { mockCategories, mockProducts, mockSiteSettings } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  Category,
  Locale,
  ProductWithRelations,
  SiteSettings,
} from "@/lib/types";

function sortImages(product: ProductWithRelations) {
  return {
    ...product,
    images: [...(product.images || [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured()) {
    return mockSiteSettings;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error("Failed to load site settings", error);
    return mockSiteSettings;
  }

  return data;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured()) {
    return mockCategories;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load categories", error);
    return [];
  }

  return data;
});

export const getProducts = cache(
  async (categorySlug?: string): Promise<ProductWithRelations[]> => {
    if (!isSupabaseConfigured()) {
      return mockProducts
        .filter((product) => {
          if (!categorySlug) return true;
          return product.category?.slug === categorySlug;
        })
        .map(sortImages);
    }

    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (!category) {
        return [];
      }

      query = query.eq("category_id", category.id);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error("Failed to load products", error);
      return [];
    }

    return (data as unknown as ProductWithRelations[]).map(sortImages);
  },
);

export const getFeaturedProducts = cache(
  async (): Promise<ProductWithRelations[]> => {
    const products = await getProducts();
    return products.filter((product) => product.is_featured).slice(0, 6);
  },
);

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductWithRelations | null> => {
    if (!isSupabaseConfigured()) {
      return mockProducts.find((product) => product.slug === slug) ?? null;
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      console.error("Failed to load product", error);
      return null;
    }

    return sortImages(data as unknown as ProductWithRelations);
  },
);

export function productName(product: ProductWithRelations, locale: Locale) {
  return localize(locale, product.name_en, product.name_ru);
}

export function productSummary(product: ProductWithRelations, locale: Locale) {
  return localize(locale, product.summary_en, product.summary_ru);
}

export function productDescription(
  product: ProductWithRelations,
  locale: Locale,
) {
  return localize(locale, product.description_en, product.description_ru);
}

export function categoryName(category: Category, locale: Locale) {
  return localize(locale, category.name_en, category.name_ru);
}
