"use client";

import { useState } from "react";

const platformOptions = ["Instagram", "Facebook", "LinkedIn", "TikTok", "WhatsApp", "Telegram"];

type SocialLinksManagerProps = {
  initialLinks: any[];
};

export function SocialLinksManager({ initialLinks }: SocialLinksManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateRow = (index: number, key: string, value: unknown) => {
    setLinks((prev: any[]) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const addRow = () => {
    setLinks((prev: any[]) => [
      ...prev,
      { id: undefined, platform: "Instagram", label: "Instagram", url: "", is_active: true, sort_order: prev.length }
    ]);
  };

  const removeRow = async (index: number) => {
    const row = links[index];
    if (row?.id) {
      await fetch(`/api/admin/social-links/${row.id}`, { method: "DELETE" });
    }
    setLinks((prev: any[]) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const saveAll = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      for (const [index, row] of links.entries()) {
        const payload = {
          platform: row.platform,
          label: row.label,
          url: row.url,
          is_active: row.is_active,
          sort_order: index
        };
        const response = await fetch(row.id ? `/api/admin/social-links/${row.id}` : "/api/admin/social-links", {
          method: row.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to save social links");
      }

      setMessage("Social links saved.");
    } catch (saveError) {
      setError(String(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="surface-card-strong p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy">Social Links</h2>
        <button type="button" className="btn-secondary px-3 py-2" onClick={addRow}>
          Add Link
        </button>
      </div>

      <div className="space-y-3">
        {links.map((row: any, index: number) => (
          <div key={`${row.id ?? "new"}-${index}`} className="grid gap-2 rounded-soft border border-border p-3 md:grid-cols-[160px_160px_1fr_110px_90px]">
            <select className="rounded-soft border border-border px-2 py-2 text-sm" value={row.platform} onChange={(e) => updateRow(index, "platform", e.target.value)}>
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <input className="rounded-soft border border-border px-2 py-2 text-sm" value={row.label} onChange={(e) => updateRow(index, "label", e.target.value)} placeholder="Label" />
            <input className="rounded-soft border border-border px-2 py-2 text-sm" value={row.url} onChange={(e) => updateRow(index, "url", e.target.value)} placeholder="https://..." />
            <label className="inline-flex items-center gap-2 rounded-soft border border-border px-2 py-2 text-sm text-navy/75">
              <input type="checkbox" checked={row.is_active} onChange={(e) => updateRow(index, "is_active", e.target.checked)} />
              Active
            </label>
            <button type="button" className="rounded-soft border border-red-200 px-2 py-2 text-sm font-semibold text-red-600" onClick={() => void removeRow(index)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button type="button" className="btn-primary" onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save Social Links"}
        </button>
      </div>

      {message ? <p className="mt-3 rounded-soft border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
