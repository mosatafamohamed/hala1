export const dynamic = "force-dynamic";
import { ReactNode } from "react";

import { AdminSignOutButton } from "@/app/admin/_components/admin-signout-button";
import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import { requireAdminUser } from "@/lib/supabase/auth";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminUser();

  return (
    <main className="min-h-screen bg-slate/45">
      <div className="container-shell py-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-border/70 bg-white p-4 shadow-card">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy/55">1Hala Admin</p>
            <h1 className="text-2xl font-bold text-navy">CMS Dashboard</h1>
            <p className="text-sm text-navy/65">{user.email}</p>
          </div>
          <AdminSignOutButton />
        </header>

        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <AdminSidebar />
          <section className="space-y-6">{children}</section>
        </div>
      </div>
    </main>
  );
}

