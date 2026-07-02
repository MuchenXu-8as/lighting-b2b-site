import Link from "next/link";
import { Mail } from "lucide-react";

import { dictionary, withLocale } from "@/lib/i18n";
import { getCategories, getSiteSettings } from "@/lib/public/data";
import { Locale } from "@/lib/types";
import { LanguageSwitch } from "@/components/public/language-switch";

export async function PublicHeader({ locale }: { locale: Locale }) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);
  const t = dictionary[locale];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={withLocale(locale)} className="focus-ring flex items-center gap-3">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.company_name}
              className="h-10 w-10 object-contain"
            />
          ) : (
            <span className="grid h-10 w-10 place-items-center bg-zinc-950 text-sm font-semibold text-white">
              NL
            </span>
          )}
          <span className="text-base font-semibold tracking-wide">
            {settings.company_name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex">
          <Link className="transition hover:text-zinc-950" href={withLocale(locale, "/products")}>
            {t.nav.products}
          </Link>
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              className="transition hover:text-zinc-950"
              href={`${withLocale(locale, "/products")}?category=${category.slug}`}
            >
              {category.name_en}
            </Link>
          ))}
          <Link className="transition hover:text-zinc-950" href={withLocale(locale, "/about")}>
            {t.nav.about}
          </Link>
          <Link className="transition hover:text-zinc-950" href={withLocale(locale, "/contact")}>
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch locale={locale} />
          <Link
            href={withLocale(locale, "/contact")}
            className="focus-ring hidden h-10 items-center gap-2 bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 sm:inline-flex"
          >
            <Mail size={16} />
            {t.nav.inquiry}
          </Link>
        </div>
      </div>
    </header>
  );
}
