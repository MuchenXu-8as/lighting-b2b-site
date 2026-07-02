import Link from "next/link";

import { localize, withLocale } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/public/data";
import { Locale } from "@/lib/types";

export async function PublicFooter({ locale }: { locale: Locale }) {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="text-lg font-semibold">{settings.company_name}</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-300">
            {localize(
              locale,
              settings.footer_tagline_en,
              settings.footer_tagline_ru,
            ) || settings.hero_subtitle_en}
          </p>
        </div>
        <div className="text-sm text-zinc-300">
          <div className="font-semibold text-white">Contact</div>
          <div className="mt-4 space-y-2">
            <p>{settings.contact_email}</p>
            {settings.contact_phone ? <p>{settings.contact_phone}</p> : null}
            <p>
              {localize(
                locale,
                settings.contact_address_en,
                settings.contact_address_ru,
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <Link href={withLocale(locale, "/products")} className="text-zinc-300 hover:text-white">
            Products
          </Link>
          <Link href={withLocale(locale, "/about")} className="text-zinc-300 hover:text-white">
            About
          </Link>
          <Link href={withLocale(locale, "/contact")} className="text-zinc-300 hover:text-white">
            Contact
          </Link>
          <Link href="/admin" className="text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
