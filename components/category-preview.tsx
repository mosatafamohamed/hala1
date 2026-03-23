import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Category } from "@/lib/types";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";

type CategoryPreviewProps = {
  hubName: string;
  categories: Category[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function CategoryPreview({
  hubName,
  categories,
  eyebrow,
  title,
  description
}: CategoryPreviewProps) {
  return (
    <section className="section-shell bg-slate/70">
      <Container>
        <SectionHeading
          eyebrow={eyebrow ?? "Category Focus"}
          title={title ?? `${hubName} Portfolio Categories`}
          description={
            description ??
            "A structured snapshot of category verticals currently active across our premium sourcing programs."
          }
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <article key={category.slug} className="surface-card card-hover-lift flex flex-col overflow-hidden">
              <div className="relative h-36 overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition duration-500 hover:scale-105"
                  style={{ backgroundImage: `url(${category.heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/35 to-transparent" />
                <p className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
                  {category.badge}
                </p>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-navy">{category.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/75">{category.preview}</p>
              </div>
              <Link
                href={`/category/${category.slug}`}
                className="mx-6 mb-6 inline-flex items-center text-sm font-semibold text-navy transition hover:text-bronze"
              >
                Open Category Brief
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
