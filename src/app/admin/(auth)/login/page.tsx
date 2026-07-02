import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { SetupNotice } from "@/components/admin/setup-notice";
import { getAdminAuth } from "@/lib/admin/auth";

export default async function AdminLoginPage() {
  const auth = await getAdminAuth();

  if (!auth.configured) {
    return <SetupNotice />;
  }

  if (auth.user && auth.isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
