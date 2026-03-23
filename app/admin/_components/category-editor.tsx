"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { ImageUploadField } from "@/app/admin/_components/image-upload-field";

type CategoryEditorProps = {
  categoryId?: string;
  hubs: Array<{ id: string; name: string }>;
  initialValue?: any;
};

export function CategoryEditor({ categoryId, hubs, initialValue }: CategoryEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    hub_id: initialValue?.hub_id ?? "",
    name: initialValue?.name ?? "",
    slug: initialValue?.slug ?? "",
    short_description: initialValue?.short_description ?? "",
    hero_title: initialValue?.hero_title ?? "",
    hero_subtitle: initialValue?.hero_subtitle ?? "",
    hero_badge: initialValue?.hero_badge ?? "",
    hero_image: initialValue?.hero_image ?? "",
    portfolio_section_title: initialValue?.portfolio_section_title ?? "Our Portfolio",
    portfolio_section_subtitle: initialValue?.portfolio_section_subtitle ?? "",
    process_section_title: initialValue?.process_section_title ?? "How We Operate",
    process_section_subtitle: initialValue?.process_section_subtitle ?? "",
    inquiry_section_title: initialValue?.inquiry_section_title ?? "Inquiry",
    inquiry_section_subtitle: initialValue?.inquiry_section_subtitle ?? "",
    sort_order: initialValue?.sort_order ?? 0,
    status: initialValue?.status ?? "draft",
    seo_title: initialValue?.seo_title ?? "",
    seo_description: initialValue?.seo_description ?? ""
  });
  const [processSteps, setProcessSteps] = useState<
    Array<{ step_number: number; title: string; description: string; icon_key: string }>
  >(
    initialValue?.process_steps?.length > 0
      ? initialValue.process_steps
      : [
          { step_number: 1, title: "", description: "", icon_key: "" },
          { step_number: 2, title: "", description: "", icon_key: "" },
          { step_number: 3, title: "", description: "", icon_key: "" }
        ]
  );

  const payload = useMemo(
    () => ({
      ...form,
      hub_id: form.hub_id || null,
      process_steps: processSteps
        .map((step, index) => ({ ...step, step_number: index + 1 }))
        .filter((step) => step.title.trim() && step.description.trim())
    }),
    [form, processSteps]
  );

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(categoryId ? `/api/admin/categories/${categoryId}` : "/api/admin/categories", {
        method: categoryId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Save failed");
      }

      setSuccess("Category saved.");
      if (!categoryId) {
        router.push(`/admin/categories/${result.data.id}`);
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
    if (!categoryId) return;
    if (!window.confirm("Delete this category?")) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      router.push("/admin/categories");
      router.refresh();
    } catch (deleteError) {
      setError(String(deleteError));
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="surface-card-strong p-6">
        <h2 className="text-2xl font-bold text-navy">{categoryId ? "Edit Category" : "Create Category"}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Name</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Slug</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
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
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Status</span>
            <select className="w-full rounded-soft border border-border px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Short Description</span>
            <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={3} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Hero Title</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Hero Subtitle</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Hero Badge</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.hero_badge} onChange={(e) => setForm({ ...form, hero_badge: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Sort Order</span>
            <input type="number" className="w-full rounded-soft border border-border px-3 py-2" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Portfolio Section Title</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.portfolio_section_title} onChange={(e) => setForm({ ...form, portfolio_section_title: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Portfolio Section Subtitle</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.portfolio_section_subtitle} onChange={(e) => setForm({ ...form, portfolio_section_subtitle: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Process Section Title</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.process_section_title} onChange={(e) => setForm({ ...form, process_section_title: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Process Section Subtitle</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.process_section_subtitle} onChange={(e) => setForm({ ...form, process_section_subtitle: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Inquiry Section Title</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.inquiry_section_title} onChange={(e) => setForm({ ...form, inquiry_section_title: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Inquiry Section Subtitle</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={form.inquiry_section_subtitle} onChange={(e) => setForm({ ...form, inquiry_section_subtitle: e.target.value })} />
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
          <ImageUploadField label="Hero Image" value={form.hero_image} folder="categories/hero" onChange={(nextValue) => setForm({ ...form, hero_image: nextValue })} />
        </div>
      </section>

      <section className="surface-card-strong p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-navy">Process Steps</h3>
          <button type="button" className="btn-secondary px-3 py-2" onClick={() => setProcessSteps((prev) => [...prev, { step_number: prev.length + 1, title: "", description: "", icon_key: "" }])}>
            <Plus className="mr-1 h-4 w-4" />
            Add Step
          </button>
        </div>
        <div className="space-y-3">
          {processSteps.map((step, index) => (
            <div key={`step-${index}`} className="grid gap-2 rounded-soft border border-border p-3 md:grid-cols-[100px_1fr_1fr_180px_auto]">
              <input type="number" className="rounded-soft border border-border px-3 py-2" value={index + 1} readOnly />
              <input className="rounded-soft border border-border px-3 py-2" placeholder="Title" value={step.title} onChange={(e) => setProcessSteps((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, title: e.target.value } : item)))} />
              <input className="rounded-soft border border-border px-3 py-2" placeholder="Description" value={step.description} onChange={(e) => setProcessSteps((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, description: e.target.value } : item)))} />
              <input className="rounded-soft border border-border px-3 py-2" placeholder="Icon key" value={step.icon_key} onChange={(e) => setProcessSteps((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, icon_key: e.target.value } : item)))} />
              <button type="button" className="inline-flex items-center justify-center rounded-soft border border-red-200 px-3 py-2 text-red-600" onClick={() => setProcessSteps((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Category"}
        </button>
        {categoryId ? (
          <button type="button" className="inline-flex items-center rounded-soft border border-red-200 px-4 py-2 text-sm font-semibold text-red-600" onClick={remove} disabled={saving}>
            Delete Category
          </button>
        ) : null}
      </div>

      {error ? <p className="rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-soft border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}
    </div>
  );
}
