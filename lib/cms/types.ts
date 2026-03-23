export type CmsStatus = "draft" | "published";

export type CmsHub = {
  id: string;
  name: string;
  slug: string;
  nav_label: string;
  short_description: string;
  highlight_text: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  card_image: string | null;
  sort_order: number;
  is_active: boolean;
};

export type CmsCategory = {
  id: string;
  hub_id: string | null;
  name: string;
  slug: string;
  short_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_image: string | null;
  portfolio_section_title: string;
  portfolio_section_subtitle: string;
  process_section_title: string;
  process_section_subtitle: string;
  inquiry_section_title: string;
  inquiry_section_subtitle: string;
  sort_order: number;
  status: CmsStatus;
  seo_title: string | null;
  seo_description: string | null;
};

export type CmsCategoryProcessStep = {
  id: string;
  category_id: string;
  step_number: number;
  title: string;
  description: string;
  icon_key: string | null;
};

export type CmsProduct = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string | null;
  category_id: string | null;
  hub_id: string | null;
  hero_image: string | null;
  tags: string[];
  cta_label: string | null;
  cta_link: string | null;
  sort_order: number;
  status: CmsStatus;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type CmsProductSpec = {
  id: string;
  product_id: string;
  label: string;
  value: string;
  sort_order: number;
};

export type CmsProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_hero: boolean;
};

export type CmsSiteSettings = {
  company_display_name: string;
  brand_label: string;
  logo_url: string | null;
  logo_alt: string | null;
  logo_width: number | null;
  logo_height: number | null;
  topbar_address: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_url: string;
  footer_summary: string;
  footer_trust_line: string;
  global_copyright_text: string;
  official_registration_label: string | null;
  hero_trust_metrics: string[];
  default_primary_cta_label: string | null;
  default_secondary_cta_label: string | null;
};

export type CmsSocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  is_active: boolean;
  sort_order: number;
};

export type CmsHomepageContent = {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_metrics_line: string | null;
  hero_primary_cta_label: string | null;
  hero_primary_cta_link: string | null;
  hero_secondary_cta_label: string | null;
  hero_secondary_cta_link: string | null;
  hero_trust_chips: string[];
  hubs_eyebrow: string | null;
  hubs_title: string | null;
  hubs_subtitle: string | null;
  category_preview_eyebrow: string | null;
  category_preview_title: string | null;
  category_preview_subtitle: string | null;
  stats_section_title: string | null;
  stats_items: Array<{ label: string; value: string }>;
  social_section_title: string | null;
  footer_text: string | null;
};

export type CmsBusinessHour = {
  day: string;
  hours: string;
};

export type CmsContactContent = {
  page_title: string;
  subtitle: string;
  registered_address: string;
  phone: string;
  email: string;
  business_hours: CmsBusinessHour[];
  primary_cta_label: string | null;
  secondary_cta_label: string | null;
  inquiry_helper_text: string | null;
};
