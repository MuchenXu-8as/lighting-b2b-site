import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/public/product-card";
import { dictionary, isLocale, withLocale } from "@/lib/i18n";
import { categoryName, getCategories, getProducts } from "@/lib/public/data";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { category } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(category),
  ]);
  const t = dictionary[locale].products;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
          Catalogue
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">{t.subtitle}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href={withLocale(locale, "/products")}
          className={`focus-ring border px-4 py-2 text-sm font-medium ${
            !category
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-950"
          }`}
        >
          {t.all}
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`${withLocale(locale, "/products")}?category=${item.slug}`}
            className={`focus-ring border px-4 py-2 text-sm font-medium ${
              category === item.slug
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-950"
            }`}
          >
            {categoryName(item, locale)}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
