import { notFound } from "next/navigation";

import { isLocale, localize } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/public/data";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const settings = await getSiteSettings();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
            About
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {localize(locale, settings.about_title_en, settings.about_title_ru)}
          </h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-zinc-700">
            {localize(locale, settings.about_body_en, settings.about_body_ru)}
          </p>
        </div>
        <div className="min-h-[420px] overflow-hidden bg-zinc-200">
          <img
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1300&q=80"
            alt="Nordic lighting showroom"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
