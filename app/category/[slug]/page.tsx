import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InquirySection } from "@/components/inquiry-section";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { ProcessSection } from "@/components/process-section";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import {
  getCategories,
  getCategoryBySlug,
  getHubById,
  getProductsByCategory
} from "@/lib/site-data";
import { HeroSection } from "@/components/hero-section";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Category Not Found"
    };
  }

  return {
    title: category.name,
    description: category.subtitle
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const hub = await getHubById(category.hubId);
  const categoryProducts = await getProductsByCategory(category.slug);
  const categoryLabel = category.slug.replace(/-/g, " ").toUpperCase();

  return (
    <>
      <HeroSection
        badge={category.badge}
        title={category.name}
        description={category.subtitle}
        statsLine={`${categoryProducts.length} Portfolio Lines  |  Trade Desk Review  |  Contract-Led Fulfillment`}
        backgroundImage={category.heroImage}
        primaryAction={{ label: "Request Proposal", href: "#inquiry" }}
        secondaryAction={{ label: "Contact Trade Desk", href: "/contact" }}
        trustPills={[categoryLabel, "Specification-Led", "Global Fulfillment"]}
      />

      <ProcessSection
        title={category.processTitle ?? "How We Operate"}
        description={
          category.processSubtitle ??
          "A controlled three-stage model designed to protect quality, reduce transaction friction, and secure delivery reliability."
        }
        steps={category.operationSteps}
      />

      <section className="section-shell bg-slate/70">
        <Container>
          <SectionHeading
            eyebrow="Our Portfolio"
            title={category.portfolioTitle ?? `${category.name} Product Portfolio`}
            description={category.portfolioIntro}
            actions={
              <Link href="/products" className="btn-secondary">
                View Full Product Catalog
              </Link>
            }
          />
          <PortfolioGrid
            products={categoryProducts}
            emptyMessage="No published products are currently listed for this category. Please check back soon or contact the trade desk."
          />
        </Container>
      </section>

      <InquirySection
        title={category.inquiryHeading}
        description={`${category.inquiryDescription} ${
          hub ? `You are currently browsing our ${hub.name}.` : ""
        }`}
        interestOptions={[category.name]}
        sourcePage={`/category/${category.slug}`}
        categoryName={category.name}
      />
    </>
  );
}
