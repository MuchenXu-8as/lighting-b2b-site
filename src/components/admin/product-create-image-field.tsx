"use client";

import { ChangeEvent, useState } from "react";
import { ImagePlus } from "lucide-react";

import { MAX_PRODUCT_IMAGES } from "@/lib/product-images";

export function ProductCreateImageField() {
  const [message, setMessage] = useState(`可选择本地图片，最多 ${MAX_PRODUCT_IMAGES} 张。`);
  const [hasError, setHasError] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (files.length > MAX_PRODUCT_IMAGES) {
      event.target.value = "";
      setHasError(true);
      setMessage(`每个产品最多上传 ${MAX_PRODUCT_IMAGES} 张图片，请重新选择。`);
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      event.target.value = "";
      setHasError(true);
      setMessage("只能上传图片文件。");
      return;
    }

    setHasError(false);
    setMessage(
      files.length
        ? `已选择 ${files.length} 张图片，保存产品时会一起上传。`
        : `可选择本地图片，最多 ${MAX_PRODUCT_IMAGES} 张。`,
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="mb-2 text-sm font-medium text-zinc-700">产品图片</div>
      <label className="focus-ring inline-flex h-10 cursor-pointer items-center gap-2 border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
        <ImagePlus size={16} />
        选择本地图片
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
        />
      </label>
      <p className={`mt-2 text-sm ${hasError ? "text-red-700" : "text-zinc-500"}`}>
        {message}
      </p>
    </div>
  );
}
