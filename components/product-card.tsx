import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import { Product } from "@/lib/types";
import { WatermarkImage } from "@/components/watermark-image";

type ProductCardProps = {
  product: Product;
  ctaLabel?: string;
};

export function ProductCard({ product, ctaLabel = "View Details" }: ProductCardProps) {
  const productHref = `/products/${product.slug ?? product.id}`;

  return (
    <article className="surface-card card-hover-lift group h-full overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        <WatermarkImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 1024px) 100vw, 33vw"
          imageClassName="transition duration-500 group-hover:scale-105"
          watermarkText="1Hala"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-4">
          <p className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
            {product.origin}
          </p>
          <div className="flex items-center gap-2">
            {product.featured ? (
              <p className="inline-flex items-center gap-1 rounded-full border border-bronze/55 bg-bronze/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                <Star className="h-3 w-3" />
                Featured
              </p>
            ) : null}
            <p className="rounded-full border border-bronze/40 bg-bronze/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              {product.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-xl font-bold text-navy">{product.name}</h3>
          {product.categoryName ? (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy/55">
              {product.categoryName}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-navy/75">{product.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="meta-chip border-border/90 bg-slate/40 normal-case tracking-normal text-navy/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={productHref}
          className="inline-flex items-center rounded-soft border border-navy/20 px-3 py-2 text-sm font-semibold text-navy transition hover:border-bronze/45 hover:text-bronze"
        >
          {ctaLabel}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
