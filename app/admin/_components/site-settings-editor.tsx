"use client";

import { useState } from "react";

import { ImageUploadField } from "@/app/admin/_components/image-upload-field";

type SiteSettingsEditorProps = {
  initialValue: any;
};

export function SiteSettingsEditor({ initialValue }: SiteSettingsEditorProps) {
  const [form, setForm] = useState({
    company_display_name: initialValue?.company_display_name ?? "1Hala",
    brand_label: initialValue?.brand_label ?? "1Hala",
    logo_url: initialValue?.logo_url ?? "",
    logo_alt: initialValue?.logo_alt ?? "1Hala logo",
    logo_width: initialValue?.logo_width ? String(initialValue.logo_width) : "",
    logo_height: initialValue?.logo_height ? String(initialValue.logo_height) : "",
    topbar_address: initialValue?.topbar_address ?? "",
    email: initialValue?.email ?? "",
    phone: initialValue?.phone ?? "",
    whatsapp_number: initialValue?.whatsapp_number ?? "",
    whatsapp_url: initialValue?.whatsapp_url ?? "",
    footer_summary: initialValue?.footer_summary ?? "",
    footer_trust_line: initialValue?.footer_trust_line ?? "",
    global_copyright_text: initialValue?.global_copyright_text ?? "",
    official_registration_label: initialValue?.official_registration_label ?? "",
    hero_trust_metrics: (initialValue?.hero_trust_metrics ?? []).join("\n"),
    default_primary_cta_label: initialValue?.default_primary_cta_label ?? "",
    default_secondary_cta_label: initialValue?.default_secondary_cta_label ?? ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        ...form,
        logo_width:
          form.logo_width && Number.isFinite(Number(form.logo_width)) ? Number(form.logo_width) : null,
        logo_height:
          form.logo_height && Number.isFinite(Number(form.logo_height)) ? Number(form.logo_height) : null,
        hero_trust_metrics: form.hero_trust_metrics
          .split("\n")
          .map((item: string) => item.trim())
          .filter(Boolean)
      };
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Save failed");
      setMessage("Site settings saved.");
    } catch (saveError) {
      setError(String(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="surface-card-strong p-6">
      <h2 className="text-2xl font-bold text-navy">Site Settings</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(
          [
            ["company_display_name", "Company Display Name"],
            ["brand_label", "Brand Label"],
            ["topbar_address", "Top Bar Address"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["whatsapp_number", "WhatsApp Number"],
            ["whatsapp_url", "WhatsApp URL"],
            ["default_primary_cta_label", "Default Primary CTA Label"],
            ["default_secondary_cta_label", "Default Secondary CTA Label"],
            ["official_registration_label", "Official Registration Label"],
            ["global_copyright_text", "Global Copyright Text"]
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
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Header Logo</span>
          <ImageUploadField
            label="Logo Image"
            value={form.logo_url}
            folder="branding/logo"
            onChange={(nextValue) => setForm((prev) => ({ ...prev, logo_url: nextValue }))}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Logo Alt Text</span>
          <input
            className="w-full rounded-soft border border-border px-3 py-2"
            value={form.logo_alt}
            onChange={(event) => setForm((prev) => ({ ...prev, logo_alt: event.target.value }))}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Logo Width (px)</span>
          <input
            type="number"
            min={1}
            className="w-full rounded-soft border border-border px-3 py-2"
            value={form.logo_width}
            onChange={(event) => setForm((prev) => ({ ...prev, logo_width: event.target.value }))}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Logo Height (px)</span>
          <input
            type="number"
            min={1}
            className="w-full rounded-soft border border-border px-3 py-2"
            value={form.logo_height}
            onChange={(event) => setForm((prev) => ({ ...prev, logo_height: event.target.value }))}
          />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Footer Summary</span>
          <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={3} value={form.footer_summary} onChange={(event) => setForm((prev) => ({ ...prev, footer_summary: event.target.value }))} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Footer Trust Line</span>
          <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={2} value={form.footer_trust_line} onChange={(event) => setForm((prev) => ({ ...prev, footer_trust_line: event.target.value }))} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Hero Trust Metrics (one per line)</span>
          <textarea className="w-full rounded-soft border border-border px-3 py-2" rows={4} value={form.hero_trust_metrics} onChange={(event) => setForm((prev) => ({ ...prev, hero_trust_metrics: event.target.value }))} />
        </label>
      </div>
      <div className="mt-4">
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Site Settings"}
        </button>
      </div>
      {message ? <p className="mt-3 rounded-soft border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
