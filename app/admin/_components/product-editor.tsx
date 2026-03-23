"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { ImageUploadField } from "@/app/admin/_components/image-upload-field";

type ProductEditorProps = {
  productId?: string;
  categories: Array<{ id: string; name: string }>;
  hubs: Array<{ id: string; name: string }>;
  initialValue?: any;
};

export function ProductEditor({ productId, categories, hubs, initialValue }: ProductEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: initialValue?.title ?? "",
    slug: initialValue?.slug ?? "",
    short_description: initialValue?.short_description ?? "",
    long_description: initialValue?.long_description ?? "",
    category_id: initialValue?.category_id ?? "",
    hub_id: initialValue?.hub_id ?? "",
    hero_image: initialValue?.hero_image ?? "",
    tags: (initialValue?.tags ?? []).join(", "),
    cta_label: initialValue?.cta_label ?? "View Specification",
    cta_link: initialValue?.cta_link ?? "/contact",
    sort_order: initialValue?.sort_order ?? 0,
    status: initialValue?.status ?? "draft",
    featured: initialValue?.featured ?? false,
    seo_title: initialValue?.seo_title ?? "",
    seo_description: initialValue?.seo_description ?? ""
  });
  const [specs, setSpecs] = useState<Array<{ label: string; value: string; sort_order: number }>>(
    initialValue?.specs?.length > 0 ? initialValue.specs : [{ label: "", value: "", sort_order: 0 }]
  );
  const [images, setImages] = useState<Array<{ image_url: string; alt_text: string; sort_order: number; is_hero: boolean }>>(
    initialValue?.images?.length > 0
      ? initialValue.images
      : [{ image_url: "", alt_text: "", sort_order: 0, is_hero: true }]
  );

  const payload = useMemo(
    () => ({
      ...form,
      category_id: form.category_id || null,
      hub_id: form.hub_id || null,
      tags: form.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean),
      specs: specs
        .map((spec, index) => ({ ...spec, sort_order: index }))
        .filter((spec) => spec.label.trim() && spec.value.trim()),
      images: images
        .map((image, index) => ({ ...image, sort_order: index }))
        .filter((image) => image.image_url.trim())
    }),
    [form, specs, images]
  );

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method: productId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Save failed");
      }

      setSuccess("Product saved.");
      if (!productId) {
        router.push(`/admin/products/${result.data.id}`);
      } else {
        router.refresh();
      }
    } catch (saveError) {
      setError(String(saveError));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!productId) return;
    if (!window.confirm("Delete this product?")) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      router.push("/admin/products");
      router.refresh();
    } catch (deleteError) {
      setError(String(deleteError));
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="surface-card-strong p-6">
        <h2 className="text-2xl font-bold text-navy">{productId ? "Edit Product" : "Create Product"}</h2>
        <p className="mt-2 text-sm text-navy/70">Manage product details, publishing status, specs, and gallery.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Title</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Slug</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Short Description</span>
            <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={3} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Long Description</span>
            <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={5} value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Category</span>
            <select className="w-full rounded-soft border border-border px-3 py-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Hub</span>
            <select className="w-full rounded-soft border border-border px-3 py-2" value={form.hub_id} onChange={(e) => setForm({ ...form, hub_id: e.target.value })}>
              <option value="">Select hub</option>
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Tags (comma separated)</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Sort Order</span>
            <input type="number" className="w-full rounded-soft border border-border px-3 py-2" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Status</span>
            <select className="w-full rounded-soft border border-border px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-navy/75">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured product
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">CTA Label</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">CTA Link</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">SEO Title</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">SEO Description</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
          </label>
        </div>

        <div className="mt-4">
          <ImageUploadField label="Hero Image" value={form.hero_image} folder="products/hero" onChange={(nextValue) => setForm({ ...form, hero_image: nextValue })} />
        </div>
      </section>

      <section className="surface-card-strong p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-navy">Product Specs</h3>
          <button
            type="button"
            className="btn-secondary px-3 py-2"
            onClick={() => setSpecs((prev) => [...prev, { label: "", value: "", sort_order: prev.length }])}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Spec
          </button>
        </div>
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={`spec-${index}`} className="grid gap-2 rounded-soft border border-border p-3 md:grid-cols-[1fr_1fr_auto]">
              <input className="rounded-soft border border-border px-3 py-2" placeholder="Label" value={spec.label} onChange={(e) => setSpecs((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, label: e.target.value } : item)))} />
              <input className="rounded-soft border border-border px-3 py-2" placeholder="Value" value={spec.value} onChange={(e) => setSpecs((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, value: e.target.value } : item)))} />
              <button type="button" className="inline-flex items-center justify-center rounded-soft border border-red-200 px-3 py-2 text-red-600" onClick={() => setSpecs((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card-strong p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-navy">Gallery Images</h3>
          <button
            type="button"
            className="btn-secondary px-3 py-2"
            onClick={() => setImages((prev) => [...prev, { image_url: "", alt_text: "", sort_order: prev.length, is_hero: false }])}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Image
          </button>
        </div>
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={`image-${index}`} className="rounded-soft border border-border p-4">
              <ImageUploadField
                label={`Image ${index + 1}`}
                value={image.image_url}
                folder="products/gallery"
                onChange={(nextValue) =>
                  setImages((prev) =>
                    prev.map((item, itemIndex) => (itemIndex === index ? { ...item, image_url: nextValue } : item))
                  )
                }
              />
              <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto_auto]">
                <input className="rounded-soft border border-border px-3 py-2" placeholder="Alt text" value={image.alt_text} onChange={(e) => setImages((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, alt_text: e.target.value } : item)))} />
                <label className="inline-flex items-center gap-2 rounded-soft border border-border px-3 py-2 text-sm text-navy/70">
                  <input type="checkbox" checked={image.is_hero} onChange={(e) => setImages((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, is_hero: e.target.checked } : item)))} />
                  Hero
                </label>
                <button type="button" className="inline-flex items-center justify-center rounded-soft border border-red-200 px-3 py-2 text-red-600" onClick={() => setImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Product"}
        </button>
        {productId ? (
          <button type="button" className="inline-flex items-center rounded-soft border border-red-200 px-4 py-2 text-sm font-semibold text-red-600" onClick={remove} disabled={saving}>
            Delete Product
          </button>
        ) : null}
      </div>

      {error ? <p className="rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-soft border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}
    </div>
  );
}
