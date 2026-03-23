import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hub } from "@/lib/types";

type HubCardProps = {
  hub: Hub;
};

export function HubCard({ hub }: HubCardProps) {
  const hubCategories = hub.categories;

  return (
    <article className="surface-card-strong card-hover-lift group h-full overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${hub.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07172D]/95 via-[#102B49]/58 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-bronze">{hub.highlight}</p>
          <h3 className="mt-2 text-2xl font-bold leading-tight">{hub.name}</h3>
        </div>
      </div>
      <div className="space-y-5 p-7">
        <p className="text-sm leading-relaxed text-navy/78">{hub.description}</p>
        <div className="flex flex-wrap gap-2">
          {hubCategories.map((categorySlug) => (
            <span
              key={categorySlug}
              className="meta-chip border-slate bg-slate/40 normal-case tracking-normal text-navy/70"
            >
              {categorySlug
                .split("-")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")}
            </span>
          ))}
        </div>
        <Link
          href={hub.href}
          className="inline-flex items-center text-sm font-semibold text-navy transition hover:text-bronze"
        >
          Enter Hub Portfolio
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
