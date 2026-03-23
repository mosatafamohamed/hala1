"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ProductsTableProps = {
  products: any[];
};

export function ProductsTable({ products }: ProductsTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"order" | "title">("order");

  const categoryOptions = useMemo(() => {
    const values = new Set<string>();
    for (const product of products) {
      const categoryName = product.categories?.name;
      if (categoryName) values.add(categoryName);
    }
    return [...values];
  }, [products]);

  const filtered = useMemo(() => {
    return products
      .filter((product) => {
        const matchSearch =
          !search ||
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.slug.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === "all" || product.status === status;
        const matchCategory = category === "all" || product.categories?.name === category;
        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) =>
        sort === "order"
          ? a.sort_order - b.sort_order
          : a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );
  }, [products, search, status, category, sort]);

  return (
    <section className="surface-card-strong p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy">Products</h2>
        <Link href="/admin/products/new" className="btn-primary">
          New Product
        </Link>
      </div>

      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_170px_220px_160px]">
        <input
          className="rounded-soft border border-border px-3 py-2"
          placeholder="Search by title or slug"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select className="rounded-soft border border-border px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select className="rounded-soft border border-border px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All Categories</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select className="rounded-soft border border-border px-3 py-2" value={sort} onChange={(event) => setSort(event.target.value as "order" | "title")}>
          <option value="order">Sort by order</option>
          <option value="title">Sort by title</option>
        </select>
      </div>

      <div className="overflow-auto rounded-soft border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-slate/45 text-left text-xs uppercase tracking-[0.11em] text-navy/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {filtered.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-navy">{product.title}</p>
                  <p className="text-xs text-navy/60">{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-navy/75">{product.categories?.name ?? "Unassigned"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-border px-2 py-1 text-xs">{product.status}</span>
                </td>
                <td className="px-4 py-3 text-navy/75">{product.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-navy/75">{product.sort_order}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${product.id}`} className="text-sm font-semibold text-bronze hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-navy/60" colSpan={6}>
                  No products match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
