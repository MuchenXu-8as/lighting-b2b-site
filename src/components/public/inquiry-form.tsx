import { submitInquiry } from "@/app/actions";
import { dictionary } from "@/lib/i18n";
import { Locale, ProductWithRelations } from "@/lib/types";

export function InquiryForm({
  locale,
  product,
  redirectTo,
  sent,
  error,
}: {
  locale: Locale;
  product?: ProductWithRelations | null;
  redirectTo: string;
  sent?: boolean;
  error?: boolean;
}) {
  const t = dictionary[locale].form;

  return (
    <form action={submitInquiry} className="border border-zinc-200 bg-white p-6">
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <input type="hidden" name="product_id" value={product?.id || ""} />
      <input type="hidden" name="product_sku" value={product?.sku || ""} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">{t.title}</h2>
          {product ? (
            <p className="mt-1 text-sm text-zinc-500">{product.sku}</p>
          ) : null}
        </div>
      </div>

      {sent ? (
        <div className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t.success}
        </div>
      ) : null}
      {error ? (
        <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Please check the required fields and try again.
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          {t.name}
          <input
            required
            name="name"
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-zinc-950"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          {t.email}
          <input
            required
            type="email"
            name="email"
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-zinc-950"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          {t.company}
          <input
            name="company"
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-zinc-950"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          {t.country}
          <input
            name="country"
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-zinc-950"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          {t.phone}
          <input
            name="phone"
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-zinc-950"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          {t.message}
          <textarea
            required
            name="message"
            minLength={10}
            rows={5}
            className="focus-ring mt-2 w-full resize-y border border-zinc-300 bg-white px-3 py-3 text-zinc-950"
            defaultValue={
              product ? `Please send quotation and lead time for ${product.sku}.` : ""
            }
          />
        </label>
      </div>

      <button
        type="submit"
        className="focus-ring mt-6 h-12 bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        {t.submit}
      </button>
    </form>
  );
}
