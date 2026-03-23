import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.13em] text-navy/58">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition hover:text-bronze">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-navy/86" : undefined}>{item.label}</span>
            )}
            {!isLast ? <ChevronRight className="h-3.5 w-3.5 text-navy/40" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
