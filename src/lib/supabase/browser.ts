"use client";

import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/lib/types";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
