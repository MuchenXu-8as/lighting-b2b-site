import { Save } from "lucide-react";

import { saveSettingsAction } from "@/app/admin/actions";
import { LogoPicker } from "@/components/admin/logo-picker";
import { PasswordForm } from "@/components/admin/password-form";
import { getAdminSettings } from "@/lib/admin/data";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [settings, notices] = await Promise.all([
    getAdminSettings(),
    searchParams,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">首页内容与站点设置</h1>
        <p className="mt-1 text-sm text-zinc-500">
          管理 logo、公司名称、首页主文案、About 和 Contact。俄文页面会自动沿用英文内容。
        </p>
      </div>
      {notices.saved ? (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          设置已保存。
        </div>
      ) : null}
      {notices.error ? (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {notices.error}
        </div>
      ) : null}

      <form action={saveSettingsAction} className="border border-zinc-200 bg-white p-5">
        <input type="hidden" name="id" value={settings.id} />
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="text-sm font-medium text-zinc-700">
            公司名称
            <input
              required
              name="company_name"
              defaultValue={settings.company_name}
              className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
            />
          </label>
          <div>
            <div className="mb-2 text-sm font-medium text-zinc-700">Logo</div>
            <LogoPicker name="logo_url" initialUrl={settings.logo_url} />
          </div>
          <label className="text-sm font-medium text-zinc-700">
            首页标题 EN
            <input required name="hero_title_en" defaultValue={settings.hero_title_en} className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3" />
          </label>
          <label className="text-sm font-medium text-zinc-700 lg:col-span-2">
            首页副标题 EN
            <textarea required name="hero_subtitle_en" rows={3} defaultValue={settings.hero_subtitle_en} className="focus-ring mt-2 w-full border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            About 标题 EN
            <input required name="about_title_en" defaultValue={settings.about_title_en} className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3" />
          </label>
          <label className="text-sm font-medium text-zinc-700 lg:col-span-2">
            About 内容 EN
            <textarea required name="about_body_en" rows={6} defaultValue={settings.about_body_en} className="focus-ring mt-2 w-full border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            联系邮箱
            <input required type="email" name="contact_email" defaultValue={settings.contact_email} className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3" />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            联系电话
            <input name="contact_phone" defaultValue={settings.contact_phone || ""} className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3" />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            地址 EN
            <input name="contact_address_en" defaultValue={settings.contact_address_en || ""} className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3" />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            页脚标语 EN
            <input name="footer_tagline_en" defaultValue={settings.footer_tagline_en || ""} className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3" />
          </label>
          <label className="text-sm font-medium text-zinc-700 lg:col-span-2">
            社媒链接 JSON
            <textarea name="socials" rows={5} defaultValue={JSON.stringify(settings.socials || {}, null, 2)} className="focus-ring mt-2 w-full border border-zinc-300 px-3 py-2 font-mono text-xs" />
          </label>
        </div>
        <button className="focus-ring mt-6 inline-flex h-11 items-center gap-2 bg-zinc-950 px-5 text-sm font-semibold text-white">
          <Save size={16} />
          保存站点设置
        </button>
      </form>

      <PasswordForm />
    </div>
  );
}
