import { saveInquiryAction } from "@/app/admin/actions";
import { getAdminInquiries } from "@/lib/admin/data";
import { inquiryStatuses, InquiryStatus } from "@/lib/types";

const labels: Record<InquiryStatus, string> = {
  new: "新询盘",
  contacted: "已联系",
  quoted: "已报价",
  won: "已成交",
  lost: "已丢单",
  archived: "已归档",
};

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [inquiries, notices] = await Promise.all([
    getAdminInquiries(),
    searchParams,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">询盘管理</h1>
      <p className="mt-1 text-sm text-zinc-500">
        切换状态、记录跟进备注，便于后续报价与成交追踪。
      </p>

      {notices.saved ? (
        <div className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          询盘状态已更新。
        </div>
      ) : null}
      {notices.error ? (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {notices.error}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {inquiries.length === 0 ? (
          <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            暂无询盘。
          </div>
        ) : null}
        {inquiries.map((inquiry) => (
          <form
            key={inquiry.id}
            action={saveInquiryAction}
            className="border border-zinc-200 bg-white p-5"
          >
            <input type="hidden" name="id" value={inquiry.id} />
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold text-zinc-950">{inquiry.name}</span>
                  <span className="text-zinc-500">{inquiry.email}</span>
                  {inquiry.company ? <span className="text-zinc-500">{inquiry.company}</span> : null}
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-700">
                  {inquiry.message}
                </p>
                <div className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-3">
                  <span>产品：{inquiry.product?.sku || inquiry.product_sku || "-"}</span>
                  <span>国家：{inquiry.country || "-"}</span>
                  <span>{new Date(inquiry.created_at).toLocaleString("zh-CN")}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  状态
                  <select
                    name="status"
                    defaultValue={inquiry.status}
                    className="focus-ring mt-2 h-10 w-full border border-zinc-300 px-3"
                  >
                    {inquiryStatuses.map((status) => (
                      <option key={status} value={status}>
                        {labels[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="mt-4 block text-sm font-medium text-zinc-700">
                  后台备注
                  <textarea
                    name="admin_note"
                    rows={4}
                    defaultValue={inquiry.admin_note || ""}
                    className="focus-ring mt-2 w-full border border-zinc-300 px-3 py-2"
                  />
                </label>
                <button className="focus-ring mt-4 h-10 bg-zinc-950 px-4 text-sm font-semibold text-white">
                  保存跟进
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
