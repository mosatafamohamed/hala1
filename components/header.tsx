"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { CompanyInfo } from "@/lib/types";
import { Container } from "@/components/ui/container";

const navLinks = [
  { label: "Construction Hub", href: "/category/building-materials" },
  { label: "Industrial Hub", href: "/category/petroleum" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" }
];

type HeaderProps = {
  companyInfo: CompanyInfo;
};

export function Header({ companyInfo }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const logo = companyInfo.logo;
  const logoWidth = logo?.width && logo.width > 0 ? logo.width : 152;
  const logoHeight = logo?.height && logo.height > 0 ? logo.height : 44;

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/88">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="inline-flex items-center gap-3">
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt ?? `${companyInfo.name} logo`}
              width={logoWidth}
              height={logoHeight}
              className="h-11 w-auto object-contain"
              priority
            />
          ) : (
            <>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-soft border border-navy/25 bg-navy text-sm font-bold text-white">
                1
              </span>
              <span className="font-heading text-xl font-bold text-navy">Hala</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze lg:inline-flex">
                Executive Trade
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-navy/80 transition hover:text-navy",
                  isActive && "text-navy"
                )}
              >
                <span className="relative">
                  {item.label}
                  {isActive ? (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded bg-bronze" />
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact#inquiry" className="btn-primary hidden md:inline-flex">
            Get Quote
          </Link>
          <button
            type="button"
            className="inline-flex rounded-soft border border-border p-2 text-navy md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-border bg-white md:hidden">
          <Container className="space-y-2 py-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-soft px-3 py-2 text-sm font-medium text-navy/80 hover:bg-slate/55"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact#inquiry"
              className="btn-primary mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Get Quote
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
