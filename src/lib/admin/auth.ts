import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminAuthState = {
  configured: boolean;
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
};

export async function getAdminAuth(): Promise<AdminAuthState> {
  if (!isSupabaseConfigured()) {
    return { configured: false, user: null, isAdmin: false };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, user: null, isAdmin: false };
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  return {
    configured: true,
    user: { id: user.id, email: user.email },
    isAdmin: Boolean(isAdmin),
  };
}

export async function requireAdmin() {
  const auth = await getAdminAuth();

  if (!auth.configured) {
    return auth;
  }

  if (!auth.user || !auth.isAdmin) {
    redirect("/admin/login");
  }

  return auth;
}
