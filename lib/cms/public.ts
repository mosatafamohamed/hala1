import { categories as fallbackCategories } from "@/data/categories";
import { companyInfo as fallbackCompanyInfo } from "@/data/company";
import { hubs as fallbackHubs } from "@/data/hubs";
import { products as fallbackProducts } from "@/data/products";
import { cache } from "react";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { hasSupabaseServiceEnv } from "@/lib/supabase/env";
import { Category, CompanyInfo, Hub, Product } from "@/lib/types";

type PublicHomepageContent = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMetricsLine: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaLink: string;
  heroTrustChips: string[];
  hubsEyebrow: string;
  hubsTitle: string;
  hubsSubtitle: string;
  categoryPreviewEyebrow: string;
  categoryPreviewTitle: string;
  categoryPreviewSubtitle: string;
  statsSectionTitle: string;
  statsItems: Array<{ label: string; value: string }>;
  socialSectionTitle: string;
  footerText: string;
};

type PublicContactContent = {
  pageTitle: string;
  subtitle: string;
  registeredAddress: string;
  phone: string;
  email: string;
  businessHours: Array<{ day: string; hours: string }>;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  inquiryHelperText: string;
};

export type PublicSiteContent = {
  companyInfo: CompanyInfo;
  hubs: Hub[];
  categories: Category[];
  products: Product[];
  homepage: PublicHomepageContent;
  contact: PublicContactContent;
};

const fallbackHomepage: PublicHomepageContent = {
  heroBadge: "Premium Global Trade Network",
  heroTitle: "Executive International Trade with Structured Delivery Control",
  heroSubtitle:
    "1Hala coordinates sourcing, compliance, and logistics for organizations executing high-value cross-border commerce.",
  heroMetricsLine: "28+ Countries  |  140+ Approved Suppliers  |  $420M Annual Trade Volume",
  heroPrimaryCtaLabel: "Enter Trade Portfolio",
  heroPrimaryCtaLink: "/category/building-materials",
  heroSecondaryCtaLabel: "Speak with Trade Desk",
  heroSecondaryCtaLink: "/contact",
  heroTrustChips: ["Compliance-Led Execution", "Document-Controlled Shipments", "Cross-Border Coordination"],
  hubsEyebrow: "Core Hubs",
  hubsTitle: "Two Strategic Hubs. One Unified Premium Standard.",
  hubsSubtitle:
    "Each hub is built around sector-specific intelligence, audited supply routes, and disciplined execution frameworks.",
  categoryPreviewEyebrow: "Category Focus",
  categoryPreviewTitle: "Portfolio Categories",
  categoryPreviewSubtitle: "A structured snapshot of active trade categories across our sourcing network.",
  statsSectionTitle: "Performance Snapshot",
  statsItems: fallbackCompanyInfo.stats,
  socialSectionTitle: "Follow 1Hala Corporate Updates",
  footerText: "Global trade. Structured execution. Premium delivery."
};

const fallbackContact: PublicContactContent = {
  pageTitle: "Connect with the 1Hala Executive Trade Desk",
  subtitle:
    "Share your sourcing objective, origin-destination flow, and target schedule. Our specialists will return a structured commercial response.",
  registeredAddress: fallbackCompanyInfo.address,
  phone: fallbackCompanyInfo.phone,
  email: fallbackCompanyInfo.email,
  businessHours: fallbackCompanyInfo.businessHours,
  primaryCtaLabel: "Contact Channels",
  secondaryCtaLabel: "Corporate Inquiry Form",
  inquiryHelperText: "Submit your request and we will provide a structured response with commercial next steps."
};

function resolveHubHref(hubSlug: string, categories: Category[]) {
  const firstCategory = categories.find((category) => category.hubId === hubSlug);
  return firstCategory ? `/category/${firstCategory.slug}` : "/contact";
}

function fallbackSlug(name: string, id: string) {
  const normalized = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  return normalized || id;
}

function validateHubCategoryCoverage(hubs: Hub[], categories: Category[]) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const knownHubSlugs = new Set(["construction-lifestyle", "industrial-agricultural"]);

  for (const hub of hubs) {
    if (!knownHubSlugs.has(hub.id)) {
      continue;
    }

    const categoryCount = categories.filter((category) => category.hubId === hub.id).length;
    if (categoryCount === 0) {
      console.warn(`[cms/public] Hub "${hub.id}" has zero mapped categories. Check category.hub_id to hub mapping.`);
    }
  }
}

async function fetchFromSupabase(): Promise<PublicSiteContent | null> {
  if (!hasSupabaseServiceEnv()) {
    return null;
  }

  try {
    const supabase = createSupabaseServiceClient();

    const [
      hubsRes,
      categoriesRes,
      stepsRes,
      productsRes,
      specsRes,
      productImagesRes,
      siteSettingsRes,
      socialRes,
      homepageRes,
      contactRes
    ] = await Promise.all([
      supabase.from("hubs").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase
        .from("categories")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase.from("category_process_steps").select("*").order("step_number", { ascending: true }),
      supabase
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true }),
      supabase.from("product_specs").select("*").order("sort_order", { ascending: true }),
      supabase.from("product_images").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("social_links").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("homepage_content").select("*").eq("id", 1).maybeSingle(),
      supabase.from("contact_content").select("*").eq("id", 1).maybeSingle()
    ]);

    if (hubsRes.error || categoriesRes.error || productsRes.error) {
      return null;
    }

    const steps = stepsRes.data ?? [];
    const rawHubs = hubsRes.data ?? [];
    const rawCategories = categoriesRes.data ?? [];
    const hubSlugById = new Map(rawHubs.map((hub) => [hub.id, hub.slug]));

    const categories: Category[] = rawCategories.map((category) => ({
      slug: category.slug,
      // CMS stores category.hub_id as hub record id; UI filter expects hub slug.
      hubId: category.hub_id ? hubSlugById.get(category.hub_id) ?? "" : "",
      name: category.name,
      badge: category.hero_badge,
      subtitle: category.hero_subtitle,
      preview: category.short_description,
      heroImage: category.hero_image ?? "/images/categories/building-materials.svg",
      portfolioTitle: category.portfolio_section_title,
      portfolioIntro: category.portfolio_section_subtitle,
      processTitle: category.process_section_title,
      processSubtitle: category.process_section_subtitle,
      inquiryHeading: category.inquiry_section_title,
      inquiryDescription: category.inquiry_section_subtitle,
      operationSteps: steps
        .filter((step) => step.category_id === category.id)
        .sort((a, b) => a.step_number - b.step_number)
        .map((step) => ({
          title: step.title,
          description: step.description
        }))
    }));

    const hubs: Hub[] = rawHubs.map((hub) => ({
      id: hub.slug,
      name: hub.name,
      navLabel: hub.nav_label,
      description: hub.short_description,
      highlight: hub.highlight_text,
      image: hub.card_image ?? "/images/hubs/construction-hub.svg",
      href: resolveHubHref(hub.slug, categories),
      categories: categories.filter((category) => category.hubId === hub.slug).map((category) => category.slug)
    }));
    validateHubCategoryCoverage(hubs, categories);

    const specs = specsRes.data ?? [];
    const productImages = productImagesRes.data ?? [];
    const categoryById = new Map(rawCategories.map((category) => [category.id, category]));
    const hubById = new Map(rawHubs.map((hub) => [hub.id, hub]));

    const products: Product[] = (productsRes.data ?? []).map((product) => {
      const originSpec = specs.find(
        (spec) => spec.product_id === product.id && spec.label.toLowerCase().includes("origin")
      );
      const category = categoryById.get(product.category_id);
      const hub = hubById.get(product.hub_id);
      const productGallery = productImages
        .filter((image) => image.product_id === product.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((image) => ({
          id: image.id,
          url: image.image_url,
          alt: image.alt_text ?? product.title,
          isHero: image.is_hero,
          sortOrder: image.sort_order
        }));
      const heroImage =
        productGallery.find((image) => image.isHero)?.url ??
        product.hero_image ??
        productGallery[0]?.url ??
        "/images/products/building-materials.svg";
      const productSpecs = specs
        .filter((spec) => spec.product_id === product.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((spec) => ({
          id: spec.id,
          label: spec.label,
          value: spec.value,
          sortOrder: spec.sort_order
        }));

      return {
        id: product.id,
        slug: product.slug,
        categorySlug: category?.slug ?? "",
        categoryName: category?.name,
        hubId: hub?.slug ?? "",
        hubName: hub?.name,
        name: product.title,
        origin: originSpec?.value ?? "Global Supply Network",
        description: product.short_description,
        longDescription: product.long_description ?? undefined,
        image: heroImage,
        gallery: productGallery.length > 0 ? productGallery : [{ url: heroImage, alt: product.title, isHero: true }],
        specs: productSpecs,
        tags: product.tags ?? [],
        ctaLabel: product.cta_label ?? "Request Commercial Terms",
        ctaLink: product.cta_link ?? "/contact",
        featured: product.featured,
        sortOrder: product.sort_order,
        seoTitle: product.seo_title ?? undefined,
        seoDescription: product.seo_description ?? undefined,
        createdAt: product.created_at ?? undefined
      };
    });

    const siteSettings = siteSettingsRes.data;
    const socialLinks = socialRes.data ?? [];
    const homepage = homepageRes.data;
    const contact = contactRes.data;

    const companyInfo: CompanyInfo = {
      name: siteSettings?.company_display_name ?? fallbackCompanyInfo.name,
      brandLabel: siteSettings?.brand_label ?? fallbackCompanyInfo.brandLabel ?? fallbackCompanyInfo.name,
      tagline: siteSettings?.footer_summary ?? fallbackCompanyInfo.tagline,
      executiveStatement: siteSettings?.footer_trust_line ?? fallbackCompanyInfo.executiveStatement,
      address: siteSettings?.topbar_address ?? fallbackCompanyInfo.address,
      email: siteSettings?.email ?? fallbackCompanyInfo.email,
      phone: siteSettings?.phone ?? fallbackCompanyInfo.phone,
      whatsapp: {
        label: "WhatsApp",
        href: siteSettings?.whatsapp_url ?? fallbackCompanyInfo.whatsapp.href
      },
      socialLinks:
        socialLinks.length > 0
          ? socialLinks.map((item) => ({ label: item.label, href: item.url }))
          : fallbackCompanyInfo.socialLinks,
      businessHours: Array.isArray(contact?.business_hours) ? contact.business_hours : fallbackCompanyInfo.businessHours,
      stats:
        Array.isArray(homepage?.stats_items) && homepage.stats_items.length > 0
          ? homepage.stats_items
          : fallbackCompanyInfo.stats,
      trustCues:
        siteSettings?.hero_trust_metrics && siteSettings.hero_trust_metrics.length > 0
          ? siteSettings.hero_trust_metrics
          : fallbackCompanyInfo.trustCues,
      logo: siteSettings?.logo_url
        ? {
            url: siteSettings.logo_url,
            alt: siteSettings.logo_alt ?? siteSettings.company_display_name ?? "1Hala logo",
            width: typeof siteSettings.logo_width === "number" ? siteSettings.logo_width : undefined,
            height: typeof siteSettings.logo_height === "number" ? siteSettings.logo_height : undefined
          }
        : fallbackCompanyInfo.logo
    };

    const homepageContent: PublicHomepageContent = {
      heroBadge: homepage?.hero_badge ?? fallbackHomepage.heroBadge,
      heroTitle: homepage?.hero_title ?? fallbackHomepage.heroTitle,
      heroSubtitle: homepage?.hero_subtitle ?? fallbackHomepage.heroSubtitle,
      heroMetricsLine: homepage?.hero_metrics_line ?? fallbackHomepage.heroMetricsLine,
      heroPrimaryCtaLabel: homepage?.hero_primary_cta_label ?? fallbackHomepage.heroPrimaryCtaLabel,
      heroPrimaryCtaLink: homepage?.hero_primary_cta_link ?? fallbackHomepage.heroPrimaryCtaLink,
      heroSecondaryCtaLabel: homepage?.hero_secondary_cta_label ?? fallbackHomepage.heroSecondaryCtaLabel,
      heroSecondaryCtaLink: homepage?.hero_secondary_cta_link ?? fallbackHomepage.heroSecondaryCtaLink,
      heroTrustChips: homepage?.hero_trust_chips ?? fallbackHomepage.heroTrustChips,
      hubsEyebrow: homepage?.hubs_eyebrow ?? fallbackHomepage.hubsEyebrow,
      hubsTitle: homepage?.hubs_title ?? fallbackHomepage.hubsTitle,
      hubsSubtitle: homepage?.hubs_subtitle ?? fallbackHomepage.hubsSubtitle,
      categoryPreviewEyebrow: homepage?.category_preview_eyebrow ?? fallbackHomepage.categoryPreviewEyebrow,
      categoryPreviewTitle: homepage?.category_preview_title ?? fallbackHomepage.categoryPreviewTitle,
      categoryPreviewSubtitle: homepage?.category_preview_subtitle ?? fallbackHomepage.categoryPreviewSubtitle,
      statsSectionTitle: homepage?.stats_section_title ?? fallbackHomepage.statsSectionTitle,
      statsItems: Array.isArray(homepage?.stats_items) ? homepage.stats_items : fallbackHomepage.statsItems,
      socialSectionTitle: homepage?.social_section_title ?? fallbackHomepage.socialSectionTitle,
      footerText: homepage?.footer_text ?? fallbackHomepage.footerText
    };

    const contactContent: PublicContactContent = {
      pageTitle: contact?.page_title ?? fallbackContact.pageTitle,
      subtitle: contact?.subtitle ?? fallbackContact.subtitle,
      registeredAddress: contact?.registered_address ?? companyInfo.address,
      phone: contact?.phone ?? companyInfo.phone,
      email: contact?.email ?? companyInfo.email,
      businessHours: Array.isArray(contact?.business_hours) ? contact.business_hours : fallbackContact.businessHours,
      primaryCtaLabel: contact?.primary_cta_label ?? fallbackContact.primaryCtaLabel,
      secondaryCtaLabel: contact?.secondary_cta_label ?? fallbackContact.secondaryCtaLabel,
      inquiryHelperText: contact?.inquiry_helper_text ?? fallbackContact.inquiryHelperText
    };

    return {
      companyInfo,
      hubs,
      categories,
      products,
      homepage: homepageContent,
      contact: contactContent
    };
  } catch {
    return null;
  }
}

export const getPublicSiteContent = cache(async (): Promise<PublicSiteContent> => {
  const cmsContent = await fetchFromSupabase();

  if (cmsContent) {
    return cmsContent;
  }

  return {
    companyInfo: fallbackCompanyInfo,
    hubs: fallbackHubs,
    categories: fallbackCategories,
    products: fallbackProducts.map((product) => ({
      ...product,
      slug: fallbackSlug(product.name, product.id),
      gallery: [{ url: product.image, alt: product.name, isHero: true }],
      specs: [],
      ctaLabel: "View Details",
      ctaLink: "/contact",
      featured: false,
      sortOrder: 0,
      seoTitle: product.name,
      seoDescription: product.description
    })),
    homepage: fallbackHomepage,
    contact: fallbackContact
  };
});
