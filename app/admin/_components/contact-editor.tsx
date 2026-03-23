"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type ContactEditorProps = {
  initialValue: any;
};

export function ContactEditor({ initialValue }: ContactEditorProps) {
  const [form, setForm] = useState({
    page_title: initialValue?.page_title ?? "",
    subtitle: initialValue?.subtitle ?? "",
    registered_address: initialValue?.registered_address ?? "",
    phone: initialValue?.phone ?? "",
    email: initialValue?.email ?? "",
    primary_cta_label: initialValue?.primary_cta_label ?? "",
    secondary_cta_label: initialValue?.secondary_cta_label ?? "",
    inquiry_helper_text: initialValue?.inquiry_helper_text ?? ""
  });
  const [hours, setHours] = useState<Array<{ day: string; hours: string }>>(
    initialValue?.business_hours?.length > 0
      ? initialValue.business_hours
      : [{ day: "Monday - Friday", hours: "09:00 - 18:00" }]
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, business_hours: hours })
      });
      if (!response.ok) throw new Error("Save failed");
      setMessage("Contact content saved.");
    } catch (saveError) {
      setError(String(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="surface-card-strong p-6">
      <h2 className="text-2xl font-bold text-navy">Contact Content</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(
          [
            ["page_title", "Page Title"],
            ["subtitle", "Subtitle"],
            ["registered_address", "Registered Address"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["primary_cta_label", "Primary CTA Label"],
            ["secondary_cta_label", "Secondary CTA Label"],
            ["inquiry_helper_text", "Inquiry Helper Text"]
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">{label}</span>
            <input className="w-full rounded-soft border border-border px-3 py-2" value={(form as any)[key]} onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))} />
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-soft border border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-navy">Business Hours</h3>
          <button type="button" className="btn-secondary px-3 py-2" onClick={() => setHours((prev) => [...prev, { day: "", hours: "" }])}>
            <Plus className="mr-1 h-4 w-4" />
            Add Row
          </button>
        </div>
        <div className="space-y-2">
          {hours.map((row, index) => (
            <div key={`hour-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input className="rounded-soft border border-border px-3 py-2" value={row.day} placeholder="Day" onChange={(event) => setHours((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, day: event.target.value } : item)))} />
              <input className="rounded-soft border border-border px-3 py-2" value={row.hours} placeholder="Hours" onChange={(event) => setHours((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, hours: event.target.value } : item)))} />
              <button type="button" className="inline-flex items-center justify-center rounded-soft border border-red-200 px-3 py-2 text-red-600" onClick={() => setHours((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Contact Content"}
        </button>
      </div>
      {message ? <p className="mt-3 rounded-soft border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
