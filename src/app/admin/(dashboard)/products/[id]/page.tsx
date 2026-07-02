import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { ProductImageManager } from "@/components/admin/product-image-manager";
import { getAdminCategories, getAdminProduct } from "@/lib/admin/data";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string; error?: string }>;
}) {
  const [{ id }, notices] = await Promise.all([params, searchParams]);
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">编辑产品</h1>
        <p className="mt-1 text-sm text-zinc-500">{product.sku}</p>
      </div>
      {notices.saved || notices.created ? (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          产品已保存。
        </div>
      ) : null}
      {notices.error ? (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {notices.error}
        </div>
      ) : null}
      <ProductForm product={product} categories={categories} />
      <ProductImageManager
        productId={product.id}
        initialImages={product.images || []}
      />
    </div>
  );
}
