create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null default 'Nordlite Export',
  logo_url text,
  hero_title_en text not null default 'Minimal lighting for calm commercial spaces',
  hero_title_ru text,
  hero_subtitle_en text not null default 'Pendant, wall, track, and outdoor luminaires designed for B2B export projects.',
  hero_subtitle_ru text,
  about_title_en text not null default 'Export-ready lighting, designed with restraint',
  about_title_ru text,
  about_body_en text not null default 'We develop LED luminaires with clean profiles, stable finishes, and practical packaging for B2B buyers.',
  about_body_ru text,
  contact_email text not null default 'sales@example.com',
  contact_phone text,
  contact_address_en text,
  contact_address_ru text,
  footer_tagline_en text,
  footer_tagline_ru text,
  socials jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ru text,
  description_en text,
  description_ru text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  sku text not null unique,
  slug text not null unique,
  name_en text not null,
  name_ru text,
  summary_en text,
  summary_ru text,
  description_en text,
  description_ru text,
  specs jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_en text,
  alt_ru text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_sku text,
  name text not null,
  email text not null,
  company text,
  country text,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'archived')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

insert into public.site_settings (company_name)
values ('Nordlite Export')
on conflict do nothing;

insert into storage.buckets (id, name, public)
values
  ('site-assets', 'site-assets', true),
  ('product-images', 'product-images', true)
on conflict (id) do nothing;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inquiries enable row level security;

create policy "Admins can read admin profiles"
on public.admin_profiles for select
to authenticated
using (public.is_admin());

create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "Admins can manage site settings"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read active categories"
on public.categories for select
to anon, authenticated
using (is_active = true or public.is_admin());

create policy "Admins can manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published products"
on public.products for select
to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "Admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published product images"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and (products.status = 'published' or public.is_admin())
  )
);

create policy "Admins can manage product images"
on public.product_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can create inquiries"
on public.inquiries for insert
to anon, authenticated
with check (status = 'new' and admin_note is null);

create policy "Admins can manage inquiries"
on public.inquiries for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read site assets"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('site-assets', 'product-images'));

create policy "Admins can upload site assets"
on storage.objects for insert
to authenticated
with check (bucket_id in ('site-assets', 'product-images') and public.is_admin());

create policy "Admins can update site assets"
on storage.objects for update
to authenticated
using (bucket_id in ('site-assets', 'product-images') and public.is_admin())
with check (bucket_id in ('site-assets', 'product-images') and public.is_admin());

create policy "Admins can delete site assets"
on storage.objects for delete
to authenticated
using (bucket_id in ('site-assets', 'product-images') and public.is_admin());
