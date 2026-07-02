import { notFound } from "next/navigation";

import { InquiryForm } from "@/components/public/inquiry-form";
import { isLocale, localize } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/public/data";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [settings, notices] = await Promise.all([
    getSiteSettings(),
    searchParams,
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Send your project requirement
          </h1>
          <div className="mt-8 space-y-5 border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-700">
            <div>
              <div className="font-semibold text-zinc-950">Email</div>
              <div>{settings.contact_email}</div>
            </div>
            {settings.contact_phone ? (
              <div>
                <div className="font-semibold text-zinc-950">Phone</div>
                <div>{settings.contact_phone}</div>
              </div>
            ) : null}
            <div>
              <div className="font-semibold text-zinc-950">Address</div>
              <div>
                {localize(
                  locale,
                  settings.contact_address_en,
                  settings.contact_address_ru,
                )}
              </div>
            </div>
          </div>
        </div>
        <InquiryForm
          locale={locale}
          redirectTo={`/${locale}/contact`}
          sent={notices.sent === "1"}
          error={notices.error === "1"}
        />
      </div>
    </section>
  );
}
