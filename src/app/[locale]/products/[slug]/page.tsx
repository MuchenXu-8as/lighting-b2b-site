import { notFound } from "next/navigation";

import { InquiryForm } from "@/components/public/inquiry-form";
import { dictionary, isLocale, localize } from "@/lib/i18n";
import {
  getProductBySlug,
  productDescription,
  productName,
  productSummary,
} from "@/lib/public/data";

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const notices = await searchParams;
  const image = product.images?.[0];
  const specs =
    product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? Object.entries(product.specs)
      : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
            {image ? (
              <img
                src={image.image_url}
                alt={localize(locale, image.alt_en, image.alt_ru) || productName(product, locale)}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          {product.images && product.images.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((item) => (
                <img
                  key={item.id}
                  src={item.image_url}
                  alt={localize(locale, item.alt_en, item.alt_ru)}
                  className="aspect-square w-full object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
            {product.sku}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {productName(product, locale)}
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            {productSummary(product, locale)}
          </p>
          <p className="mt-6 leading-8 text-zinc-700">
            {productDescription(product, locale)}
          </p>

          {specs.length ? (
            <div className="mt-8 border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-5 py-4 text-sm font-semibold">
                {dictionary[locale].products.specs}
              </div>
              <dl className="divide-y divide-zinc-100">
                {specs.map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-5 py-3 text-sm">
                    <dt className="font-medium text-zinc-600">{key}</dt>
                    <dd className="text-zinc-950">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
        <InquiryForm
          locale={locale}
          product={product}
          redirectTo={`/${locale}/products/${product.slug}`}
          sent={notices.sent === "1"}
          error={notices.error === "1"}
        />
      </div>
    </section>
  );
}
