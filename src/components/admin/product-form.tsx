import { Save } from "lucide-react";

import { saveProductAction } from "@/app/admin/actions";
import { ProductCreateImageField } from "@/components/admin/product-create-image-field";
import { Category, ProductWithRelations } from "@/lib/types";

function textValue(value: string | null | undefined) {
  return value || "";
}

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductWithRelations | null;
  categories: Category[];
}) {
  return (
    <form
      action={saveProductAction}
      encType="multipart/form-data"
      className="border border-zinc-200 bg-white p-5"
    >
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          SKU
          <input
            required
            name="sku"
            defaultValue={textValue(product?.sku)}
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          URL Slug
          <input
            required
            name="slug"
            defaultValue={textValue(product?.slug)}
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          分类
          <select
            name="category_id"
            defaultValue={textValue(product?.category_id)}
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          >
            <option value="">未分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_en}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-zinc-700">
          状态
          <select
            name="status"
            defaultValue={product?.status || "draft"}
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          >
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </label>
        <label className="text-sm font-medium text-zinc-700">
          英文名称
          <input
            required
            name="name_en"
            defaultValue={textValue(product?.name_en)}
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 lg:col-span-2">
          英文摘要
          <textarea
            name="summary_en"
            rows={3}
            defaultValue={textValue(product?.summary_en)}
            className="focus-ring mt-2 w-full border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 lg:col-span-2">
          英文详情
          <textarea
            name="description_en"
            rows={6}
            defaultValue={textValue(product?.description_en)}
            className="focus-ring mt-2 w-full border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 lg:col-span-2">
          规格参数 JSON
          <textarea
            name="specs"
            rows={7}
            defaultValue={JSON.stringify(product?.specs || {}, null, 2)}
            className="focus-ring mt-2 w-full border border-zinc-300 px-3 py-2 font-mono text-xs"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          排序
          <input
            name="sort_order"
            type="number"
            defaultValue={product?.sort_order ?? 100}
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          />
        </label>
        <label className="flex items-center gap-3 pt-8 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={Boolean(product?.is_featured)}
            className="h-4 w-4"
          />
          首页推荐
        </label>
        {!product ? <ProductCreateImageField /> : null}
      </div>
      <button
        type="submit"
        className="focus-ring mt-6 inline-flex h-11 items-center gap-2 bg-zinc-950 px-5 text-sm font-semibold text-white"
      >
        <Save size={16} />
        保存产品
      </button>
    </form>
  );
}
