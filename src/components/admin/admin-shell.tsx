import { AdminMobileNav, AdminNav } from "@/components/admin/admin-nav";

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-950">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:block">
        <AdminNav />
      </div>
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-stone-50/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold md:hidden">外贸站后台</div>
            <div>
              <p className="text-sm text-zinc-500">当前管理员</p>
              <p className="text-sm font-medium">{email || "Admin"}</p>
            </div>
          </div>
        </header>
        <AdminMobileNav />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
