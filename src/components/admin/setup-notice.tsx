export function SetupNotice() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="mx-auto max-w-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h1 className="text-xl font-semibold">需要先配置 Supabase</h1>
        <p className="mt-3 leading-7">
          请复制 `.env.example` 为 `.env.local`，填入
          `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
          然后在 Supabase 执行 `supabase/migrations` 里的初始化 SQL，
          创建 Auth 用户并把该用户 id 插入 `admin_profiles`。
        </p>
      </div>
    </div>
  );
}
