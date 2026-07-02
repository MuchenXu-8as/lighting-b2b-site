"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Trash2 } from "lucide-react";

import { MAX_PRODUCT_IMAGES } from "@/lib/product-images";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ProductImage } from "@/lib/types";

function SortableImage({
  image,
  onDelete,
}: {
  image: ProductImage;
  onDelete: (image: ProductImage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="border border-zinc-200 bg-white"
    >
      <img
        src={image.image_url}
        alt={image.alt_en || "Product image"}
        className="aspect-square w-full object-cover"
      />
      <div className="flex items-center justify-between gap-2 p-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="focus-ring inline-flex h-9 w-9 items-center justify-center border border-zinc-300 text-zinc-600"
          title="拖拽排序"
        >
          <GripVertical size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(image)}
          className="focus-ring inline-flex h-9 w-9 items-center justify-center border border-red-200 text-red-700 hover:bg-red-50"
          title="删除图片"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function ProductImageManager({
  productId,
  initialImages,
}: {
  productId: string;
  initialImages: ProductImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const sensors = useSensors(useSensor(PointerSensor));
  const remainingSlots = MAX_PRODUCT_IMAGES - images.length;
  const uploadDisabled = busy || remainingSlots <= 0;

  async function persistOrder(nextImages: ProductImage[]) {
    await Promise.all(
      nextImages.map((image, index) =>
        supabase
          .from("product_images")
          .update({ sort_order: index + 1 })
          .eq("id", image.id),
      ),
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((image) => image.id === active.id);
    const newIndex = images.findIndex((image) => image.id === over.id);
    const nextImages = arrayMove(images, oldIndex, newIndex);
    setImages(nextImages);
    await persistOrder(nextImages);
    setMessage("图片排序已保存。");
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (files.length > remainingSlots) {
      setMessage(
        remainingSlots > 0
          ? `当前还能上传 ${remainingSlots} 张图片，每个产品最多 ${MAX_PRODUCT_IMAGES} 张。`
          : `每个产品最多上传 ${MAX_PRODUCT_IMAGES} 张图片。`,
      );
      event.target.value = "";
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setMessage("只能上传图片文件。");
      event.target.value = "";
      return;
    }

    setBusy(true);
    setMessage("");
    let nextImages = images;

    for (const [index, file] of files.entries()) {
      const safeName =
        file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-") || "image";
      const path = `${productId}/${Date.now()}-${index}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file);

      if (uploadError) {
        setMessage(uploadError.message);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      const { data, error } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          image_url: publicUrl.publicUrl,
          storage_path: path,
          alt_en: file.name,
          sort_order: nextImages.length + 1,
        })
        .select("*")
        .single();

      if (error || !data) {
        setMessage(error?.message || "图片记录保存失败");
      } else {
        nextImages = [...nextImages, data];
        setImages(nextImages);
      }
    }

    setBusy(false);
    setMessage("图片已上传。");
    event.target.value = "";
  }

  async function handleDelete(image: ProductImage) {
    setBusy(true);
    if (image.storage_path) {
      await supabase.storage.from("product-images").remove([image.storage_path]);
    }
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image.id);

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    const nextImages = images.filter((item) => item.id !== image.id);
    setImages(nextImages);
    await persistOrder(nextImages);
    setBusy(false);
    setMessage("图片已删除。");
  }

  return (
    <section className="border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">产品多图</h2>
          <p className="mt-1 text-sm text-zinc-500">
            每个产品最多 {MAX_PRODUCT_IMAGES} 张，拖拽图片即可调整前台展示顺序。
          </p>
        </div>
        <label
          className={`focus-ring inline-flex h-10 items-center gap-2 px-4 text-sm font-semibold ${
            uploadDisabled
              ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
              : "cursor-pointer bg-zinc-950 text-white"
          }`}
        >
          <ImagePlus size={16} />
          {busy ? "处理中..." : remainingSlots <= 0 ? "已达 5 张" : "上传图片"}
          <input
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={handleUpload}
            disabled={uploadDisabled}
          />
        </label>
      </div>

      {message ? <p className="mt-4 text-sm text-zinc-600">{message}</p> : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((image) => image.id)}
          strategy={rectSortingStrategy}
        >
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {images.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
