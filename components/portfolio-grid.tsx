import { Product } from "@/lib/types";

import { ProductCard } from "@/components/product-card";

type PortfolioGridProps = {
  products: Product[];
  emptyMessage?: string;
};

export function PortfolioGrid({
  products,
  emptyMessage = "No published products are currently available in this category."
}: PortfolioGridProps) {
  if (products.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-sm font-medium text-navy/72">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
