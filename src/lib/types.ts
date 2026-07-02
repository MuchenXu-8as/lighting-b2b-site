export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Locale = "en" | "ru";

export const locales: Locale[] = ["en", "ru"];

export const inquiryStatuses = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
  "archived",
] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

export type ProductStatus = "draft" | "published";

export type SiteSettings = {
  id: string;
  company_name: string;
  logo_url: string | null;
  hero_title_en: string;
  hero_title_ru: string | null;
  hero_subtitle_en: string;
  hero_subtitle_ru: string | null;
  about_title_en: string;
  about_title_ru: string | null;
  about_body_en: string;
  about_body_ru: string | null;
  contact_email: string;
  contact_phone: string | null;
  contact_address_en: string | null;
  contact_address_ru: string | null;
  footer_tagline_en: string | null;
  footer_tagline_ru: string | null;
  socials: Json;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name_en: string;
  name_ru: string | null;
  description_en: string | null;
  description_ru: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  sku: string;
  slug: string;
  name_en: string;
  name_ru: string | null;
  summary_en: string | null;
  summary_ru: string | null;
  description_en: string | null;
  description_ru: string | null;
  specs: Json;
  status: ProductStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string | null;
  alt_en: string | null;
  alt_ru: string | null;
  sort_order: number;
  created_at: string;
};

export type Inquiry = {
  id: string;
  product_id: string | null;
  product_sku: string | null;
  name: string;
  email: string;
  company: string | null;
  country: string | null;
  phone: string | null;
  message: string;
  status: InquiryStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductWithRelations = Product & {
  category?: Category | null;
  images?: ProductImage[];
};

export type InquiryWithProduct = Inquiry & {
  product?: Pick<Product, "id" | "sku" | "name_en" | "name_ru" | "slug"> | null;
};

export type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<Omit<SiteSettings, "created_at" | "updated_at">>;
        Update: Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Partial<Omit<Category, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<Category, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      product_images: {
        Row: ProductImage;
        Insert: Partial<Omit<ProductImage, "id" | "created_at">>;
        Update: Partial<Omit<ProductImage, "id" | "created_at">>;
        Relationships: [];
      };
      inquiries: {
        Row: Inquiry;
        Insert: Partial<Omit<Inquiry, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<Inquiry, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          id: string;
          email: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: { id: string; email?: string | null; is_active?: boolean };
        Update: { email?: string | null; is_active?: boolean };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
