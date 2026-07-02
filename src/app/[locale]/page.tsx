import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/public/product-card";
import { dictionary, isLocale, localize, withLocale } from "@/lib/i18n";
import {
  categoryName,
  getCategories,
  getFeaturedProducts,
  getSiteSettings,
} from "@/lib/public/data";

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getFeaturedProducts(),
  ]);
  const t = dictionary[locale];

  return (
    <>
      <section className="bg-stone-100">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">
              B2B Lighting Export
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              {localize(locale, settings.hero_title_en, settings.hero_title_ru)}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600 sm:text-lg">
              {localize(
                locale,
                settings.hero_subtitle_en,
                settings.hero_subtitle_ru,
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={withLocale(locale, "/products")}
                className="focus-ring inline-flex h-12 items-center gap-2 bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {t.nav.products}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={withLocale(locale, "/about")}
                className="focus-ring inline-flex h-12 items-center border border-zinc-300 px-5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-950"
              >
                {t.home.aboutCta}
              </Link>
            </div>
          </div>
          <div className="h-full min-h-[420px] overflow-hidden bg-zinc-200">
            <img
              src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80"
              alt="Minimal interior with warm pendant lighting"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`${withLocale(locale, "/products")}?category=${category.slug}`}
              className="focus-ring border border-zinc-200 p-6 transition hover:border-zinc-950"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {t.home.categories}
              </div>
              <h2 className="mt-4 text-xl font-semibold">
                {categoryName(category, locale)}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {localize(locale, category.description_en, category.description_ru)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
              Collection
            </p>
            <h2 className="mt-3 text-3xl font-semibold">{t.home.featured}</h2>
          </div>
          <Link
            href={withLocale(locale, "/products")}
            className="hidden text-sm font-semibold text-zinc-800 hover:text-zinc-950 sm:inline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
