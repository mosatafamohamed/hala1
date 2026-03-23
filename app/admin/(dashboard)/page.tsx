import Link from "next/link";

import { getAdminDashboardSummary } from "@/lib/cms/admin";

export default async function AdminDashboardPage() {
  const summary = await getAdminDashboardSummary();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-navy/60">Products</p>
          <p className="mt-2 text-3xl font-bold text-navy">{summary.products}</p>
        </article>
        <article className="surface-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-navy/60">Categories</p>
          <p className="mt-2 text-3xl font-bold text-navy">{summary.categories}</p>
        </article>
        <article className="surface-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-navy/60">Hubs</p>
          <p className="mt-2 text-3xl font-bold text-navy">{summary.hubs}</p>
        </article>
        <article className="surface-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-navy/60">Social Links</p>
          <p className="mt-2 text-3xl font-bold text-navy">{summary.socialLinks}</p>
        </article>
      </div>

      <section className="surface-card-strong p-6">
        <h2 className="text-xl font-bold text-navy">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="btn-primary">
            New Product
          </Link>
          <Link href="/admin/categories/new" className="btn-secondary">
            New Category
          </Link>
          <Link href="/admin/hubs" className="btn-secondary">
            Manage Hubs
          </Link>
          <Link href="/admin/site-settings" className="btn-secondary">
            Site Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
