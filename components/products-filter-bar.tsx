"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Category, Hub } from "@/lib/types";

type ProductSortOption = "newest" | "featured" | "alphabetical";

type ProductsFilterBarProps = {
  hubs: Hub[];
  categories: Category[];
  selectedHub: string;
  selectedCategory: string;
  selectedSort: ProductSortOption;
  query: string;
};

export function ProductsFilterBar({
  hubs,
  categories,
  selectedHub,
  selectedCategory,
  selectedSort,
  query
}: ProductsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState(query);
  const [hubValue, setHubValue] = useState(selectedHub);
  const [categoryValue, setCategoryValue] = useState(selectedCategory);
  const [sortValue, setSortValue] = useState<ProductSortOption>(selectedSort);

  useEffect(() => {
    setSearchValue(query);
    setHubValue(selectedHub);
    setCategoryValue(selectedCategory);
    setSortValue(selectedSort);
  }, [query, selectedHub, selectedCategory, selectedSort]);

  const visibleCategories = useMemo(
    () => (hubValue ? categories.filter((category) => category.hubId === hubValue) : categories),
    [categories, hubValue]
  );

  useEffect(() => {
    if (!categoryValue) {
      return;
    }

    const isCategoryAllowed = visibleCategories.some((category) => category.slug === categoryValue);
    if (!isCategoryAllowed) {
      setCategoryValue("");
    }
  }, [categoryValue, visibleCategories]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedQuery = searchValue.trim();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    if (hubValue) {
      params.set("hub", hubValue);
    }

    if (categoryValue) {
      params.set("category", categoryValue);
    }

    if (sortValue) {
      params.set("sort", sortValue);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-card mt-8 grid gap-4 p-5 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr_auto]"
    >
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/68">Search Product</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45" />
          <input
            type="search"
            name="q"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Product title"
            className="w-full rounded-soft border border-border px-9 py-2.5 text-sm"
          />
        </div>
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/68">Hub</span>
        <select
          name="hub"
          value={hubValue}
          onChange={(event) => setHubValue(event.target.value)}
          className="w-full rounded-soft border border-border px-3 py-2.5 text-sm"
        >
          <option value="">All hubs</option>
          {hubs.map((hub) => (
            <option key={hub.id} value={hub.id}>
              {hub.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/68">Category</span>
        <select
          name="category"
          value={categoryValue}
          onChange={(event) => setCategoryValue(event.target.value)}
          className="w-full rounded-soft border border-border px-3 py-2.5 text-sm"
        >
          <option value="">All categories</option>
          {visibleCategories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/68">Sort</span>
        <select
          name="sort"
          value={sortValue}
          onChange={(event) => setSortValue(event.target.value as ProductSortOption)}
          className="w-full rounded-soft border border-border px-3 py-2.5 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="featured">Featured</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </label>

      <div className="flex items-end gap-2">
        <button type="submit" className="btn-primary w-full lg:w-auto">
          Apply
        </button>
      </div>
    </form>
  );
}
