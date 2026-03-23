import { categories } from "../data/categories";
import { companyInfo } from "../data/company";
import { hubs } from "../data/hubs";
import { products } from "../data/products";
import { createSupabaseServiceClient } from "../lib/supabase/service";
import { hasSupabaseServiceEnv } from "../lib/supabase/env";

async function seed() {
  if (!hasSupabaseServiceEnv()) {
    throw new Error("Missing Supabase service environment variables.");
  }

  const supabase = createSupabaseServiceClient();

  console.log("Seeding CMS tables...");

  await supabase.from("product_specs").delete().not("id", "is", null);
  await supabase.from("product_images").delete().not("id", "is", null);
  await supabase.from("products").delete().not("id", "is", null);
  await supabase.from("category_process_steps").delete().not("id", "is", null);
  await supabase.from("categories").delete().not("id", "is", null);
  await supabase.from("hubs").delete().not("id", "is", null);
  await supabase.from("social_links").delete().not("id", "is", null);

  const hubInsert = await supabase
    .from("hubs")
    .insert(
      hubs.map((hub, index) => ({
        name: hub.name,
        slug: hub.id,
        nav_label: hub.navLabel,
        short_description: hub.description,
        highlight_text: hub.highlight,
        hero_title: hub.name,
        hero_subtitle: hub.description,
        card_image: hub.image,
        sort_order: index,
        is_active: true
      }))
    )
    .select("*");

  if (hubInsert.error) throw hubInsert.error;
  const hubMap = new Map((hubInsert.data ?? []).map((hub) => [hub.slug, hub.id]));

  const categoryInsert = await supabase
    .from("categories")
    .insert(
      categories.map((category, index) => ({
        hub_id: hubMap.get(category.hubId) ?? null,
        name: category.name,
        slug: category.slug,
        short_description: category.preview,
        hero_title: category.name,
        hero_subtitle: category.subtitle,
        hero_badge: category.badge,
        hero_image: category.heroImage,
        portfolio_section_title: "Our Portfolio",
        portfolio_section_subtitle: category.portfolioIntro,
        process_section_title: "How We Operate",
        process_section_subtitle:
          "A controlled three-stage model designed to protect quality, reduce transaction friction, and secure delivery reliability.",
        inquiry_section_title: category.inquiryHeading,
        inquiry_section_subtitle: category.inquiryDescription,
        sort_order: index,
        status: "published",
        seo_title: category.name,
        seo_description: category.subtitle
      }))
    )
    .select("*");

  if (categoryInsert.error) throw categoryInsert.error;
  const categoryMap = new Map((categoryInsert.data ?? []).map((category) => [category.slug, category.id]));

  const processSteps = categories.flatMap((category) =>
    category.operationSteps.map((step, index) => ({
      category_id: categoryMap.get(category.slug),
      step_number: index + 1,
      title: step.title,
      description: step.description,
      icon_key: index === 0 ? "search" : index === 1 ? "shield" : "badge"
    }))
  );
  if (processSteps.length > 0) {
    const stepInsert = await supabase.from("category_process_steps").insert(processSteps);
    if (stepInsert.error) throw stepInsert.error;
  }

  const productInsert = await supabase
    .from("products")
    .insert(
      products.map((product, index) => {
        const categoryId = categoryMap.get(product.categorySlug) ?? null;
        const category = categories.find((item) => item.slug === product.categorySlug);
        return {
          title: product.name,
          slug: product.id.toLowerCase(),
          short_description: product.description,
          long_description: product.description,
          category_id: categoryId,
          hub_id: category ? hubMap.get(category.hubId) ?? null : null,
          hero_image: product.image,
          tags: product.tags,
          cta_label: "Request Specification",
          cta_link: "/contact#inquiry",
          sort_order: index,
          status: "published",
          featured: index < 4,
          seo_title: product.name,
          seo_description: product.description
        };
      })
    )
    .select("*");

  if (productInsert.error) throw productInsert.error;
  const productBySlug = new Map(
    (productInsert.data ?? []).map((product) => [product.slug, product.id])
  );

  const specsInsert = await supabase.from("product_specs").insert(
    products.map((product, index) => ({
      product_id: productBySlug.get(product.id.toLowerCase()),
      label: "Origin",
      value: product.origin,
      sort_order: index
    }))
  );
  if (specsInsert.error) throw specsInsert.error;

  const productImagesInsert = await supabase.from("product_images").insert(
    products.map((product, index) => ({
      product_id: productBySlug.get(product.id.toLowerCase()),
      image_url: product.image,
      alt_text: product.name,
      sort_order: index,
      is_hero: true
    }))
  );
  if (productImagesInsert.error) throw productImagesInsert.error;

  const siteSettingsUpsert = await supabase.from("site_settings").upsert(
    {
      id: 1,
      company_display_name: companyInfo.name,
      brand_label: companyInfo.name,
      logo_url: companyInfo.logo?.url ?? null,
      logo_alt: companyInfo.logo?.alt ?? `${companyInfo.name} logo`,
      logo_width: companyInfo.logo?.width ?? null,
      logo_height: companyInfo.logo?.height ?? null,
      topbar_address: companyInfo.address,
      email: companyInfo.email,
      phone: companyInfo.phone,
      whatsapp_number: companyInfo.phone,
      whatsapp_url: companyInfo.whatsapp.href,
      footer_summary: companyInfo.tagline,
      footer_trust_line: companyInfo.executiveStatement,
      global_copyright_text: `${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.`,
      official_registration_label: "Official Global Trade Entity",
      hero_trust_metrics: companyInfo.trustCues,
      default_primary_cta_label: "Enter Trade Portfolio",
      default_secondary_cta_label: "Speak with Trade Desk"
    },
    { onConflict: "id" }
  );
  if (siteSettingsUpsert.error) throw siteSettingsUpsert.error;

  const socialInsert = await supabase.from("social_links").insert(
    companyInfo.socialLinks.map((social, index) => ({
      platform: social.label,
      label: social.label,
      url: social.href,
      is_active: true,
      sort_order: index
    }))
  );
  if (socialInsert.error) throw socialInsert.error;

  const homepageUpsert = await supabase.from("homepage_content").upsert(
    {
      id: 1,
      hero_badge: "Premium Global Trade Network",
      hero_title: "Executive International Trade with Structured Delivery Control",
      hero_subtitle:
        "1Hala coordinates sourcing, compliance, and logistics for organizations executing high-value cross-border commerce.",
      hero_metrics_line: "28+ Countries  |  140+ Approved Suppliers  |  $420M Annual Trade Volume",
      hero_primary_cta_label: "Enter Trade Portfolio",
      hero_primary_cta_link: "/category/building-materials",
      hero_secondary_cta_label: "Speak with Trade Desk",
      hero_secondary_cta_link: "/contact",
      hero_trust_chips: ["Compliance-Led Execution", "Document-Controlled Shipments", "Cross-Border Coordination"],
      hubs_eyebrow: "Core Hubs",
      hubs_title: "Two Strategic Hubs. One Unified Premium Standard.",
      hubs_subtitle:
        "Each hub is built around sector-specific intelligence, audited supply routes, and disciplined execution frameworks.",
      category_preview_eyebrow: "Category Focus",
      category_preview_title: "Portfolio Categories",
      category_preview_subtitle: "A structured snapshot of active trade categories across our sourcing network.",
      stats_section_title: "Performance Snapshot",
      stats_items: companyInfo.stats,
      social_section_title: "Follow 1Hala Corporate Updates",
      footer_text: "Global trade. Structured execution. Premium delivery."
    },
    { onConflict: "id" }
  );
  if (homepageUpsert.error) throw homepageUpsert.error;

  const contactUpsert = await supabase.from("contact_content").upsert(
    {
      id: 1,
      page_title: "Connect with the 1Hala Executive Trade Desk",
      subtitle:
        "Share your sourcing objective, origin-destination flow, and target schedule. Our specialists will return a structured commercial response.",
      registered_address: companyInfo.address,
      phone: companyInfo.phone,
      email: companyInfo.email,
      business_hours: companyInfo.businessHours,
      primary_cta_label: "Contact Channels",
      secondary_cta_label: "Corporate Inquiry Form",
      inquiry_helper_text: "Submit your request and we will provide a structured response with commercial next steps."
    },
    { onConflict: "id" }
  );
  if (contactUpsert.error) throw contactUpsert.error;

  console.log("CMS seed complete.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
