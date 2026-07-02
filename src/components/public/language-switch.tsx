"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Locale } from "@/lib/types";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "en" ? "ru" : "en";
  const href = pathname.replace(/^\/(en|ru)/, `/${nextLocale}`);

  return (
    <Link
      href={href}
      className="focus-ring inline-flex h-10 items-center justify-center border border-zinc-300 px-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-900"
    >
      {nextLocale.toUpperCase()}
    </Link>
  );
}
