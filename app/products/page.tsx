import type { Metadata } from "next";

import { ProductsFilterBar } from "@/components/products-filter-bar";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { getCategories, getCompanyInfo, getHubs, getProducts } from "@/lib/site-data";
import { Product } from "@/lib/types";

type ProductSortOption = "newest" | "featured" | "alphabetical";

type ProductsPageProps = {
  searchParams: {
    hub?: string;
    category?: string;
    q?: string;
    sort?: ProductSortOption;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const companyInfo = await getCompanyInfo();

  return {
    title: "Products",
    description:
      "Explore the 1Hala executive trade catalog across construction, industrial, and agricultural categories.",
    openGraph: {
      title: `Products | ${companyInfo.name}`,
      description:
        "Published 1Hala products with structured specifications, compliant sourcing context, and premium trade execution."
    }
  };
}

function sortProducts(products: Product[], sort: ProductSortOption) {
  switch (sort) {
    case "alphabetical":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
      return [...products].sort((a, b) => {
        if (Boolean(a.featured) !== Boolean(b.featured)) {
          return a.featured ? -1 : 1;
        }
        return (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999);
      });
    case "newest":
    default:
      return [...products].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA !== dateB) {
          return dateB - dateA;
        }
        return (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999);
      });
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, hubs, categories] = await Promise.all([getProducts(), getHubs(), getCategories()]);

  const selectedHub = searchParams.hub ?? "";
  const selectedCategory = searchParams.category ?? "";
  const query = (searchParams.q ?? "").trim().toLowerCase();
  const selectedSort = (searchParams.sort ?? "newest") as ProductSortOption;
  const isSelectedCategoryValid = selectedCategory
    ? categories.some((category) => {
        if (category.slug !== selectedCategory) {
          return false;
        }
        return selectedHub ? category.hubId === selectedHub : true;
      })
    : true;
  const effectiveSelectedCategory = isSelectedCategoryValid ? selectedCategory : "";

  const filteredProducts = sortProducts(
    products.filter((product) => {
      const matchesHub = selectedHub ? product.hubId === selectedHub : true;
      const matchesCategory = effectiveSelectedCategory ? product.categorySlug === effectiveSelectedCategory : true;
      const matchesSearch = query ? product.name.toLowerCase().includes(query) : true;
      return matchesHub && matchesCategory && matchesSearch;
    }),
    selectedSort
  );

  return (
    <>
      <section className="section-shell border-b border-border/70 bg-white">
        <Container>
          <SectionHeading
            eyebrow="Product Catalog"
            title="Public Trade Product Portfolio"
            description="Search active product lines, filter by hub or category, and review portfolio details with structured specification context."
            align="left"
          />
          <ProductsFilterBar
            hubs={hubs}
            categories={categories}
            selectedHub={selectedHub}
            selectedCategory={effectiveSelectedCategory}
            selectedSort={selectedSort}
            query={searchParams.q ?? ""}
          />
          <p className="mt-4 text-sm text-navy/68">
            Showing <span className="font-semibold text-navy">{filteredProducts.length}</span> published product
            {filteredProducts.length === 1 ? "" : "s"}.
          </p>
        </Container>
      </section>

      <section className="section-shell bg-slate/60">
        <Container>
          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="surface-card p-10 text-center">
              <h2 className="text-2xl font-bold text-navy">No matching products found</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-navy/72">
                Adjust filters or search criteria to explore available published products in the catalog.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
