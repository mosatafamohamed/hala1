"use client";

import { useState } from "react";

type HomepageEditorProps = {
  initialValue: any;
};

export function HomepageEditor({ initialValue }: HomepageEditorProps) {
  const [form, setForm] = useState({
    hero_badge: initialValue?.hero_badge ?? "",
    hero_title: initialValue?.hero_title ?? "",
    hero_subtitle: initialValue?.hero_subtitle ?? "",
    hero_metrics_line: initialValue?.hero_metrics_line ?? "",
    hero_primary_cta_label: initialValue?.hero_primary_cta_label ?? "",
    hero_primary_cta_link: initialValue?.hero_primary_cta_link ?? "",
    hero_secondary_cta_label: initialValue?.hero_secondary_cta_label ?? "",
    hero_secondary_cta_link: initialValue?.hero_secondary_cta_link ?? "",
    hero_trust_chips: (initialValue?.hero_trust_chips ?? []).join("\n"),
    hubs_eyebrow: initialValue?.hubs_eyebrow ?? "",
    hubs_title: initialValue?.hubs_title ?? "",
    hubs_subtitle: initialValue?.hubs_subtitle ?? "",
    category_preview_eyebrow: initialValue?.category_preview_eyebrow ?? "",
    category_preview_title: initialValue?.category_preview_title ?? "",
    category_preview_subtitle: initialValue?.category_preview_subtitle ?? "",
    stats_section_title: initialValue?.stats_section_title ?? "",
    stats_items: JSON.stringify(initialValue?.stats_items ?? [], null, 2),
    social_section_title: initialValue?.social_section_title ?? "",
    footer_text: initialValue?.footer_text ?? ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const parsedStats = JSON.parse(form.stats_items || "[]");
      const payload = {
        ...form,
        hero_trust_chips: form.hero_trust_chips
          .split("\n")
          .map((item: string) => item.trim())
          .filter(Boolean),
        stats_items: parsedStats
      };
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Save failed");
      setMessage("Homepage content saved.");
    } catch (saveError) {
      setError(`Save failed: ${String(saveError)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="surface-card-strong p-6">
      <h2 className="text-2xl font-bold text-navy">Homepage Content</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(
          [
            ["hero_badge", "Hero Badge"],
            ["hero_title", "Hero Title"],
            ["hero_subtitle", "Hero Subtitle"],
            ["hero_metrics_line", "Hero Metrics Line"],
            ["hero_primary_cta_label", "Hero Primary CTA Label"],
            ["hero_primary_cta_link", "Hero Primary CTA Link"],
            ["hero_secondary_cta_label", "Hero Secondary CTA Label"],
            ["hero_secondary_cta_link", "Hero Secondary CTA Link"],
            ["hubs_eyebrow", "Hubs Eyebrow"],
            ["hubs_title", "Hubs Title"],
            ["hubs_subtitle", "Hubs Subtitle"],
            ["category_preview_eyebrow", "Category Preview Eyebrow"],
            ["category_preview_title", "Category Preview Title"],
            ["category_preview_subtitle", "Category Preview Subtitle"],
            ["stats_section_title", "Stats Section Title"],
            ["social_section_title", "Social Section Title"],
            ["footer_text", "Footer Text"]
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">{label}</span>
            <input
              className="w-full rounded-soft border border-border px-3 py-2"
              value={(form as any)[key]}
              onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
            />
          </label>
        ))}

        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Hero Trust Chips (one per line)</span>
          <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={4} value={form.hero_trust_chips} onChange={(event) => setForm((prev) => ({ ...prev, hero_trust_chips: event.target.value }))} />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Stats Items JSON</span>
          <textarea className="w-full rounded-soft border border-border px-3 py-2 font-mono text-xs" rows={8} value={form.stats_items} onChange={(event) => setForm((prev) => ({ ...prev, stats_items: event.target.value }))} />
        </label>
      </div>
      <div className="mt-4">
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Homepage Content"}
        </button>
      </div>
      {message ? <p className="mt-3 rounded-soft border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
