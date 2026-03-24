import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { InquirySection } from "@/components/inquiry-section";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { Container } from "@/components/ui/container";
import { CMS_PUBLIC_REVALIDATE_SECONDS } from "@/lib/cms/revalidation";
import {
  getCategories,
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
  getRelatedProducts
} from "@/lib/site-data";

type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

export const revalidate = CMS_PUBLIC_REVALIDATE_SECONDS;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug ?? product.id }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found"
    };
  }

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description,
    openGraph: {
      title: product.seoTitle ?? product.name,
      description: product.seoDescription ?? product.description,
      type: "article",
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined
    }
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const [category, relatedProducts, categories] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getRelatedProducts(product, 3),
    getCategories()
  ]);

  return (
    <>
      <section className="section-shell border-b border-border/70 bg-white">
        <Container className="space-y-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              category ? { label: category.name, href: `/category/${category.slug}` } : { label: "Catalog" },
              { label: product.name }
            ]}
          />

          <div className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
            <ProductGallery title={product.name} images={product.gallery ?? []} />

            <aside className="surface-card flex h-fit flex-col gap-6 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-bronze">
                  {product.hubName ?? "Global Trade Portfolio"}
                </p>
                <h1 className="mt-2 text-3xl font-bold leading-tight text-navy md:text-[2.5rem]">{product.name}</h1>
                {product.categoryName ? (
                  <p className="mt-2 text-sm font-medium text-navy/66">{product.categoryName}</p>
                ) : null}
                <p className="mt-5 text-sm leading-relaxed text-navy/78">{product.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="meta-chip normal-case tracking-normal">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rounded-soft border border-border/80 bg-slate/45 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-navy/65">Trade Origin</p>
                <p className="mt-1 text-sm font-medium text-navy">{product.origin}</p>
              </div>

              <Link href={product.ctaLink ?? "/contact"} className="btn-primary w-full justify-center">
                {product.ctaLabel ?? "Request Commercial Terms"}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </aside>
          </div>
        </Container>
      </section>

      <section className="section-shell bg-slate/60">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="surface-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-navy">Product Brief</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy/78">
              {product.longDescription?.trim() || product.description}
            </p>
          </article>

          <article className="surface-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-navy">Specifications</h2>
            {product.specs && product.specs.length > 0 ? (
              <dl className="mt-5 space-y-3">
                {product.specs.map((spec, index) => (
                  <div
                    key={spec.id ?? `${spec.label}-${index}`}
                    className="grid gap-2 border-b border-border/70 pb-3 text-sm last:border-0 last:pb-0 md:grid-cols-[0.9fr_1.1fr]"
                  >
                    <dt className="font-semibold text-navy/72">{spec.label}</dt>
                    <dd className="text-navy">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-5 text-sm text-navy/72">
                Technical specifications will be shared according to inquiry scope and destination requirements.
              </p>
            )}
          </article>
        </Container>
      </section>

      <section className="section-shell bg-white">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-bronze">Related Products</p>
              <h2 className="mt-2 text-3xl font-bold text-navy">More in This Category</h2>
            </div>
            {category ? (
              <Link href={`/category/${category.slug}`} className="btn-secondary">
                Open Category Portfolio
              </Link>
            ) : null}
          </div>
          {relatedProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <div className="surface-card p-8 text-center">
              <p className="text-sm text-navy/72">
                Additional related lines are being prepared for this category.
              </p>
            </div>
          )}
        </Container>
      </section>

      <InquirySection
        title="Request Structured Commercial Terms"
        description="Share destination, required volumes, and timeline expectations. The 1Hala executive desk will return a specification-aligned commercial proposal."
        interestOptions={Array.from(new Set([product.name, ...(category ? [category.name] : categories.map((item) => item.name))]))}
        sourcePage={`/products/${product.slug ?? product.id}`}
        productName={product.name}
        categoryName={category?.name}
      />
    </>
  );
}
