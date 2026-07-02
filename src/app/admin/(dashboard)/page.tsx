import Link from "next/link";
import { Boxes, FolderTree, Inbox, Settings } from "lucide-react";

import {
  getAdminCategories,
  getAdminInquiries,
  getAdminProducts,
} from "@/lib/admin/data";

export default async function AdminHomePage() {
  const [products, categories, inquiries] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
    getAdminInquiries(),
  ]);
  const newInquiries = inquiries.filter((item) => item.status === "new").length;

  const stats = [
    { label: "产品数量", value: products.length, icon: Boxes },
    { label: "分类数量", value: categories.length, icon: FolderTree },
    { label: "新询盘", value: newInquiries, icon: Inbox },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">管理概览</h1>
          <p className="mt-1 text-sm text-zinc-500">
            管理产品目录、询盘跟进和首页内容。
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="focus-ring inline-flex h-10 items-center gap-2 border border-zinc-300 bg-white px-4 text-sm font-medium hover:border-zinc-950"
        >
          <Settings size={16} />
          编辑首页
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-zinc-200 bg-white p-5">
              <Icon size={22} className="text-brass" />
              <div className="mt-4 text-3xl font-semibold">{stat.value}</div>
              <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
