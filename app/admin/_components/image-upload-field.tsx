"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  folder: string;
  onChange: (nextValue: string) => void;
};

export function ImageUploadField({ label, value, folder, onChange }: ImageUploadFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (file: File) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Upload failed");
      }

      onChange(result.data.publicUrl);
    } catch (uploadError) {
      setError(String(uploadError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">{label}</label>
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-soft border border-border bg-white px-3 py-2 text-sm text-navy focus:border-bronze/45 focus:outline-none focus:ring-2 focus:ring-bronze/20"
        placeholder="https://..."
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-secondary cursor-pointer px-4 py-2">
          {loading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFileChange(file);
              }
            }}
          />
        </label>
        {value ? (
          <button type="button" className="text-sm font-semibold text-red-600" onClick={() => onChange("")}>
            Remove
          </button>
        ) : null}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-soft border border-border/70">
          <img src={value} alt={`${label} preview`} className="h-32 w-full object-cover" />
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
