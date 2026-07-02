import {
  Category,
  InquiryWithProduct,
  ProductWithRelations,
  SiteSettings,
} from "@/lib/types";

const now = new Date("2026-07-02T00:00:00.000Z").toISOString();

export const mockSiteSettings: SiteSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  company_name: "Nordlite Export",
  logo_url: null,
  hero_title_en: "Minimal lighting for calm commercial spaces",
  hero_title_ru: "Минималистичное освещение для спокойных коммерческих пространств",
  hero_subtitle_en:
    "Pendant, wall, track, and outdoor luminaires designed for hotels, retail interiors, and residential developments.",
  hero_subtitle_ru:
    "Подвесные, настенные, трековые и уличные светильники для отелей, магазинов и жилых проектов.",
  about_title_en: "Export-ready lighting, designed with restraint",
  about_title_ru: "Экспортное освещение в сдержанном дизайне",
  about_body_en:
    "We develop LED luminaires with clean profiles, stable finishes, and practical packaging for B2B buyers. Our team supports OEM finishes, project samples, and mixed-container orders.",
  about_body_ru:
    "Мы производим LED-светильники с чистыми формами, стабильной отделкой и практичной упаковкой для B2B-клиентов. Поддерживаем OEM-отделку, образцы для проектов и сборные контейнерные заказы.",
  contact_email: "sales@nordlite-export.com",
  contact_phone: "+86 20 0000 0000",
  contact_address_en: "Zhongshan Lighting Industrial Zone, Guangdong, China",
  contact_address_ru: "Промышленная зона освещения Чжуншань, Гуандун, Китай",
  footer_tagline_en: "Quiet forms. Reliable export supply.",
  footer_tagline_ru: "Спокойные формы. Надежные экспортные поставки.",
  socials: {
    linkedin: "https://www.linkedin.com/",
    whatsapp: "https://wa.me/8613800000000",
  },
  created_at: now,
  updated_at: now,
};

export const mockCategories: Category[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "pendant-lights",
    name_en: "Pendant Lights",
    name_ru: "Подвесные светильники",
    description_en: "Clean silhouettes for hospitality and dining areas.",
    description_ru: "Лаконичные формы для ресторанов и гостиниц.",
    sort_order: 1,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "track-lighting",
    name_en: "Track Lighting",
    name_ru: "Трековое освещение",
    description_en: "Flexible spotlights for retail and gallery projects.",
    description_ru: "Гибкие споты для магазинов и галерей.",
    sort_order: 2,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "outdoor-lights",
    name_en: "Outdoor Lights",
    name_ru: "Уличные светильники",
    description_en: "Weather-ready lighting for facades, gardens, and paths.",
    description_ru: "Светильники для фасадов, садов и дорожек.",
    sort_order: 3,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
];

export const mockProducts: ProductWithRelations[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    category_id: mockCategories[0].id,
    sku: "NL-PD-210",
    slug: "arc-pendant-210",
    name_en: "Arc Pendant 210",
    name_ru: "Arc Pendant 210",
    summary_en: "Slim aluminum pendant for dining tables and hotel lounges.",
    summary_ru: "Тонкий алюминиевый подвес для обеденных зон и лаунжей.",
    description_en:
      "A restrained pendant luminaire with a powder-coated aluminum body, opal diffuser, and warm commercial-grade LED output.",
    description_ru:
      "Сдержанный подвесной светильник с алюминиевым корпусом, опаловым рассеивателем и теплым коммерческим LED-светом.",
    specs: {
      Power: "12W / 18W",
      Material: "Aluminum + acrylic",
      Finish: "Matte white, black, champagne",
      CCT: "2700K / 3000K / 4000K",
    },
    status: "published",
    is_featured: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
    category: mockCategories[0],
    images: [
      {
        id: "img-1",
        product_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        image_url:
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
        storage_path: null,
        alt_en: "Minimal pendant lighting above a calm dining table",
        alt_ru: "Минималистичный подвесной светильник над столом",
        sort_order: 1,
        created_at: now,
      },
    ],
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    category_id: mockCategories[1].id,
    sku: "NL-TR-72",
    slug: "focus-track-72",
    name_en: "Focus Track 72",
    name_ru: "Focus Track 72",
    summary_en: "Compact adjustable spotlight for shop shelving and galleries.",
    summary_ru: "Компактный регулируемый спот для полок и галерей.",
    description_en:
      "A high-CRI track spotlight with a compact cylinder, stable rotation, and optional honeycomb louver.",
    description_ru:
      "Трековый спот с высоким CRI, компактным цилиндром, стабильным поворотом и опциональной сотой.",
    specs: {
      Power: "10W / 15W / 20W",
      CRI: "Ra90",
      Beam: "15° / 24° / 36°",
      Adapter: "2-wire / 3-wire / magnetic",
    },
    status: "published",
    is_featured: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
    category: mockCategories[1],
    images: [
      {
        id: "img-2",
        product_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        image_url:
          "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=80",
        storage_path: null,
        alt_en: "Track lighting in a minimal retail interior",
        alt_ru: "Трековое освещение в минималистичном интерьере",
        sort_order: 1,
        created_at: now,
      },
    ],
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    category_id: mockCategories[2].id,
    sku: "NL-OD-44",
    slug: "line-bollard-44",
    name_en: "Line Bollard 44",
    name_ru: null,
    summary_en: "IP65 outdoor bollard with soft pathway distribution.",
    summary_ru: null,
    description_en:
      "Outdoor bollard lighting with a low-glare optical structure, die-cast aluminum housing, and corrosion-resistant finish.",
    description_ru: null,
    specs: {
      Power: "8W / 12W",
      IP: "IP65",
      Height: "450mm / 650mm",
      Finish: "Graphite, black, custom RAL",
    },
    status: "published",
    is_featured: false,
    sort_order: 3,
    created_at: now,
    updated_at: now,
    category: mockCategories[2],
    images: [
      {
        id: "img-3",
        product_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        image_url:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        storage_path: null,
        alt_en: "Outdoor pathway lighting in a simple landscape",
        alt_ru: null,
        sort_order: 1,
        created_at: now,
      },
    ],
  },
];

export const mockInquiries: InquiryWithProduct[] = [];
