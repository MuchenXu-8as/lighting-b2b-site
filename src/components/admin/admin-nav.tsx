"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  FolderTree,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

import { signOutAction } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "概览", icon: LayoutDashboard },
  { href: "/admin/products", label: "产品管理", icon: Boxes },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree },
  { href: "/admin/inquiries", label: "询盘管理", icon: Inbox },
  { href: "/admin/settings", label: "首页内容", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-5">
        <div className="text-lg font-semibold text-zinc-950">外贸站后台</div>
        <div className="mt-1 text-xs text-zinc-500">Lighting CMS</div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex h-11 items-center gap-3 px-3 text-sm font-medium transition ${
                active
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-3">
        <Link
          href="/en"
          className="focus-ring flex h-10 items-center gap-3 px-3 text-sm text-zinc-600 hover:bg-zinc-100"
        >
          <Home size={16} />
          查看前台
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="focus-ring mt-1 flex h-10 w-full items-center gap-3 px-3 text-left text-sm text-zinc-600 hover:bg-zinc-100"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </form>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`focus-ring inline-flex h-10 shrink-0 items-center gap-2 px-3 text-sm font-medium ${
              active
                ? "bg-zinc-950 text-white"
                : "border border-zinc-200 text-zinc-700"
            }`}
          >
            <Icon size={15} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
