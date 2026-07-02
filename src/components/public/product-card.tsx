import Link from "next/link";

import { localize, withLocale } from "@/lib/i18n";
import {
  categoryName,
  productName,
  productSummary,
} from "@/lib/public/data";
import { Locale, ProductWithRelations } from "@/lib/types";

export function ProductCard({
  product,
  locale,
}: {
  product: ProductWithRelations;
  locale: Locale;
}) {
  const image = product.images?.[0];

  return (
    <Link
      href={withLocale(locale, `/products/${product.slug}`)}
      className="focus-ring group block bg-white"
    >
      <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
        {image ? (
          <img
            src={image.image_url}
            alt={localize(locale, image.alt_en, image.alt_ru) || productName(product, locale)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-zinc-500">
            No image
          </div>
        )}
      </div>
      <div className="border border-t-0 border-zinc-200 p-5">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
          <span>{product.sku}</span>
          {product.category ? (
            <span>{categoryName(product.category, locale)}</span>
          ) : null}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-950">
          {productName(product, locale)}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
          {productSummary(product, locale)}
        </p>
      </div>
    </Link>
  );
}
