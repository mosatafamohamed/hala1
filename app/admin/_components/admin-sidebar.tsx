"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, FilePenLine, Globe2, Home, Package2, Settings, Shapes } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package2 },
  { href: "/admin/categories", label: "Categories", icon: Shapes },
  { href: "/admin/hubs", label: "Hubs", icon: Building2 },
  { href: "/admin/site-settings", label: "Site Settings", icon: Settings },
  { href: "/admin/social-links", label: "Social Links", icon: Globe2 },
  { href: "/admin/homepage", label: "Homepage", icon: FilePenLine },
  { href: "/admin/contact", label: "Contact", icon: BarChart3 }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-card border border-border/70 bg-white p-4 shadow-card lg:w-64">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-navy/55">CMS Navigation</p>
      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-soft px-3 py-2 text-sm font-medium text-navy/75 transition hover:bg-slate/45 hover:text-navy",
                active && "bg-navy text-white hover:bg-navy hover:text-white"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
