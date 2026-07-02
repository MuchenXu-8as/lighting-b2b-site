"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ImageUp } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoPicker({
  name,
  initialUrl,
}: {
  name: string;
  initialUrl?: string | null;
}) {
  const [url, setUrl] = useState(initialUrl || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `logo/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setUrl(data.publicUrl);
    setBusy(false);
  }

  return (
    <div className="border border-zinc-200 bg-white p-4">
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-16 w-16 place-items-center bg-zinc-100">
          {url ? (
            <img src={url} alt="Logo preview" className="max-h-14 max-w-14 object-contain" />
          ) : (
            <ImageUp size={22} className="text-zinc-400" />
          )}
        </div>
        <label className="focus-ring inline-flex h-10 cursor-pointer items-center gap-2 border border-zinc-300 px-4 text-sm font-medium hover:border-zinc-950">
          <ImageUp size={16} />
          {busy ? "上传中..." : "上传 Logo"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleUpload}
            disabled={busy}
          />
        </label>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
