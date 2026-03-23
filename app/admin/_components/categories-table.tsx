"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CategoriesTableProps = {
  categories: any[];
};

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return categories.filter((category) => {
      const matchSearch =
        !search ||
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.slug.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "all" || category.status === status;
      return matchSearch && matchStatus;
    });
  }, [categories, search, status]);

  return (
    <section className="surface-card-strong p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy">Categories</h2>
        <Link href="/admin/categories/new" className="btn-primary">
          New Category
        </Link>
      </div>

      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_220px]">
        <input
          className="rounded-soft border border-border px-3 py-2"
          placeholder="Search by name or slug"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select className="rounded-soft border border-border px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="overflow-auto rounded-soft border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-slate/45 text-left text-xs uppercase tracking-[0.11em] text-navy/60">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Hub</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {filtered.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-navy">{category.name}</p>
                  <p className="text-xs text-navy/60">{category.slug}</p>
                </td>
                <td className="px-4 py-3 text-navy/75">{category.hubs?.name ?? "Unassigned"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-border px-2 py-1 text-xs">{category.status}</span>
                </td>
                <td className="px-4 py-3 text-navy/75">{category.sort_order}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/categories/${category.id}`} className="text-sm font-semibold text-bronze hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-navy/60" colSpan={5}>
                  No categories found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
