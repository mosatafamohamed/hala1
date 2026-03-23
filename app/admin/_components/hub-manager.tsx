"use client";

import { useState } from "react";

import { ImageUploadField } from "@/app/admin/_components/image-upload-field";

type HubManagerProps = {
  initialHubs: any[];
};

const blankHub = {
  name: "",
  slug: "",
  nav_label: "",
  short_description: "",
  highlight_text: "",
  hero_title: "",
  hero_subtitle: "",
  card_image: "",
  sort_order: 0,
  is_active: true
};

export function HubManager({ initialHubs }: HubManagerProps) {
  const [hubs, setHubs] = useState(initialHubs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(blankHub);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const startEdit = (hub: any) => {
    setEditingId(hub.id);
    setForm(hub);
    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(blankHub);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(editingId ? `/api/admin/hubs/${editingId}` : "/api/admin/hubs", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Save failed");

      if (editingId) {
        setHubs((prev: any[]) => prev.map((hub) => (hub.id === editingId ? result.data : hub)));
      } else {
        setHubs((prev: any[]) => [...prev, result.data]);
      }
      setMessage("Hub saved.");
      resetForm();
    } catch (saveError) {
      setError(String(saveError));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this hub?")) return;
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/hubs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setHubs((prev: any[]) => prev.filter((hub) => hub.id !== id));
      setMessage("Hub deleted.");
      if (editingId === id) resetForm();
    } catch (deleteError) {
      setError(String(deleteError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <section className="surface-card-strong p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-navy">Hubs</h2>
          <button type="button" className="btn-secondary px-3 py-2" onClick={resetForm}>
            New Hub
          </button>
        </div>
        <div className="space-y-3">
          {hubs.map((hub) => (
            <article key={hub.id} className="rounded-soft border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-navy">{hub.name}</h3>
                  <p className="text-xs uppercase tracking-[0.12em] text-navy/60">{hub.slug}</p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/60">
                  {hub.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <p className="mt-2 text-sm text-navy/70">{hub.short_description}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="btn-secondary px-3 py-2" onClick={() => startEdit(hub)}>
                  Edit
                </button>
                <button type="button" className="inline-flex items-center rounded-soft border border-red-200 px-3 py-2 text-sm font-semibold text-red-600" onClick={() => remove(hub.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card-strong p-6">
        <h2 className="text-xl font-bold text-navy">{editingId ? "Edit Hub" : "Create Hub"}</h2>
        <div className="mt-4 space-y-3">
          {(
            [
              ["name", "Name"],
              ["slug", "Slug"],
              ["nav_label", "Nav Label"],
              ["highlight_text", "Highlight Text"],
              ["hero_title", "Hero Title"],
              ["hero_subtitle", "Hero Subtitle"]
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">{label}</span>
              <input className="w-full rounded-soft border border-border px-3 py-2" value={form[key] ?? ""} onChange={(e) => setForm((prev: any) => ({ ...prev, [key]: e.target.value }))} />
            </label>
          ))}

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Short Description</span>
            <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={3} value={form.short_description ?? ""} onChange={(e) => setForm((prev: any) => ({ ...prev, short_description: e.target.value }))} />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Sort Order</span>
            <input type="number" className="w-full rounded-soft border border-border px-3 py-2" value={form.sort_order ?? 0} onChange={(e) => setForm((prev: any) => ({ ...prev, sort_order: Number(e.target.value) }))} />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-navy/75">
            <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => setForm((prev: any) => ({ ...prev, is_active: e.target.checked }))} />
            Active
          </label>

          <ImageUploadField label="Card Image" value={form.card_image ?? ""} folder="hubs/cards" onChange={(nextValue) => setForm((prev: any) => ({ ...prev, card_image: nextValue }))} />
        </div>

        <div className="mt-4 flex gap-2">
          <button type="button" className="btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Hub"}
          </button>
          <button type="button" className="btn-secondary" onClick={resetForm}>
            Reset
          </button>
        </div>

        {message ? <p className="mt-3 rounded-soft border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-3 rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      </section>
    </div>
  );
}
