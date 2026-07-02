import Link from "next/link";
import { Plus } from "lucide-react";

import { deleteProductAction } from "@/app/admin/actions";
import { getAdminProducts } from "@/lib/admin/data";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  const [products, notices] = await Promise.all([
    getAdminProducts(),
    searchParams,
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">产品管理</h1>
          <p className="mt-1 text-sm text-zinc-500">
            创建、编辑、发布产品，并在详情页上传多图排序。
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="focus-ring inline-flex h-10 items-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          新增产品
        </Link>
      </div>

      {notices.deleted ? (
        <div className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          产品已删除。
        </div>
      ) : null}
      {notices.error ? (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {notices.error}
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">英文名称</th>
              <th className="px-4 py-3 font-medium">分类</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium">{product.sku}</td>
                <td className="px-4 py-3">{product.name_en}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {product.category?.name_en || "-"}
                </td>
                <td className="px-4 py-3">
                  {product.status === "published" ? "已发布" : "草稿"}
                </td>
                <td className="flex items-center gap-3 px-4 py-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium text-zinc-950 underline underline-offset-4"
                  >
                    编辑
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="font-medium text-red-700 underline underline-offset-4"
                    >
                      删除
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
