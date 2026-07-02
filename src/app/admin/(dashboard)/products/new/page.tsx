import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/admin/data";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [categories, notices] = await Promise.all([
    getAdminCategories(),
    searchParams,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">新增产品</h1>
      {notices.error ? (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {notices.error}
        </div>
      ) : null}
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
