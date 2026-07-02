import { AdminShell } from "@/components/admin/admin-shell";
import { SetupNotice } from "@/components/admin/setup-notice";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();

  if (!auth.configured) {
    return <SetupNotice />;
  }

  return <AdminShell email={auth.user?.email}>{children}</AdminShell>;
}
