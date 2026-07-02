import { Save, Trash2 } from "lucide-react";

import {
  deleteCategoryAction,
  saveCategoryAction,
} from "@/app/admin/actions";
import { getAdminCategories } from "@/lib/admin/data";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const [categories, notices] = await Promise.all([
    getAdminCategories(),
    searchParams,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">分类管理</h1>
      <p className="mt-1 text-sm text-zinc-500">
        分类会用于前台产品筛选，英文为主，俄文可为空。
      </p>

      {notices.saved || notices.deleted ? (
        <div className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          操作已保存。
        </div>
      ) : null}
      {notices.error ? (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {notices.error}
        </div>
      ) : null}

      <form action={saveCategoryAction} className="mt-6 border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">新增分类</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <input required name="slug" placeholder="slug" className="focus-ring h-11 border border-zinc-300 px-3" />
          <input required name="name_en" placeholder="英文名称" className="focus-ring h-11 border border-zinc-300 px-3" />
          <input name="name_ru" placeholder="俄文名称" className="focus-ring h-11 border border-zinc-300 px-3" />
          <input name="description_en" placeholder="英文描述" className="focus-ring h-11 border border-zinc-300 px-3 lg:col-span-2" />
          <input name="sort_order" type="number" placeholder="排序" className="focus-ring h-11 border border-zinc-300 px-3" />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            启用
          </label>
        </div>
        <button className="focus-ring mt-5 inline-flex h-10 items-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white">
          <Save size={16} />
          保存分类
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <form
            key={category.id}
            action={saveCategoryAction}
            className="border border-zinc-200 bg-white p-5"
          >
            <input type="hidden" name="id" value={category.id} />
            <div className="grid gap-4 lg:grid-cols-3">
              <input required name="slug" defaultValue={category.slug} className="focus-ring h-11 border border-zinc-300 px-3" />
              <input required name="name_en" defaultValue={category.name_en} className="focus-ring h-11 border border-zinc-300 px-3" />
              <input name="name_ru" defaultValue={category.name_ru || ""} className="focus-ring h-11 border border-zinc-300 px-3" />
              <input name="description_en" defaultValue={category.description_en || ""} className="focus-ring h-11 border border-zinc-300 px-3" />
              <input name="description_ru" defaultValue={category.description_ru || ""} className="focus-ring h-11 border border-zinc-300 px-3" />
              <input name="sort_order" type="number" defaultValue={category.sort_order} className="focus-ring h-11 border border-zinc-300 px-3" />
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={category.is_active} />
                启用
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="focus-ring inline-flex h-10 items-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white">
                <Save size={16} />
                保存
              </button>
              <button
                formAction={deleteCategoryAction}
                className="focus-ring inline-flex h-10 items-center gap-2 border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
                删除
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
