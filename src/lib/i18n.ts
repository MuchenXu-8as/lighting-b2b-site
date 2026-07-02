import { Locale, locales as supportedLocales } from "@/lib/types";

export const locales = supportedLocales;

export const dictionary = {
  en: {
    nav: {
      products: "Products",
      about: "About",
      contact: "Contact",
      inquiry: "Send Inquiry",
    },
    home: {
      featured: "Featured lighting",
      categories: "Product categories",
      aboutCta: "About our production",
    },
    products: {
      title: "Lighting collection",
      subtitle: "Explore architectural, hospitality, and retail lighting built for export projects.",
      all: "All",
      specs: "Specifications",
      related: "Related products",
    },
    form: {
      title: "Project inquiry",
      name: "Name",
      email: "Email",
      company: "Company",
      country: "Country",
      phone: "Phone",
      message: "Message",
      submit: "Submit inquiry",
      success: "Your inquiry has been received. Our export team will reply soon.",
    },
  },
  ru: {
    nav: {
      products: "Продукция",
      about: "О нас",
      contact: "Контакты",
      inquiry: "Отправить запрос",
    },
    home: {
      featured: "Популярные светильники",
      categories: "Категории продукции",
      aboutCta: "О производстве",
    },
    products: {
      title: "Коллекция освещения",
      subtitle: "Архитектурные, гостиничные и коммерческие светильники для экспортных проектов.",
      all: "Все",
      specs: "Характеристики",
      related: "Похожие товары",
    },
    form: {
      title: "Запрос по проекту",
      name: "Имя",
      email: "Email",
      company: "Компания",
      country: "Страна",
      phone: "Телефон",
      message: "Сообщение",
      submit: "Отправить запрос",
      success: "Ваш запрос получен. Наша экспортная команда скоро ответит.",
    },
  },
} as const;

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function localize(
  locale: Locale,
  english: string | null | undefined,
  russian?: string | null,
) {
  if (locale === "ru" && russian?.trim()) {
    return russian;
  }

  return english?.trim() || "";
}

export function withLocale(locale: Locale, path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}
