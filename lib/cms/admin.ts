import { createSupabaseServiceClient } from "@/lib/supabase/service";

type UpsertProductInput = {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  long_description?: string | null;
  category_id?: string | null;
  hub_id?: string | null;
  hero_image?: string | null;
  tags: string[];
  cta_label?: string | null;
  cta_link?: string | null;
  sort_order: number;
  status: "draft" | "published";
  featured: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  specs: Array<{ label: string; value: string; sort_order: number }>;
  images: Array<{ image_url: string; alt_text?: string | null; sort_order: number; is_hero: boolean }>;
};

type UpsertCategoryInput = {
  id?: string;
  hub_id?: string | null;
  name: string;
  slug: string;
  short_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_image?: string | null;
  portfolio_section_title: string;
  portfolio_section_subtitle: string;
  process_section_title: string;
  process_section_subtitle: string;
  inquiry_section_title: string;
  inquiry_section_subtitle: string;
  sort_order: number;
  status: "draft" | "published";
  seo_title?: string | null;
  seo_description?: string | null;
  process_steps: Array<{
    step_number: number;
    title: string;
    description: string;
    icon_key?: string | null;
  }>;
};

export async function getAdminDashboardSummary() {
  const supabase = createSupabaseServiceClient();
  const [productsRes, categoriesRes, hubsRes, socialsRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("hubs").select("id", { count: "exact", head: true }),
    supabase.from("social_links").select("id", { count: "exact", head: true })
  ]);

  return {
    products: productsRes.count ?? 0,
    categories: categoriesRes.count ?? 0,
    hubs: hubsRes.count ?? 0,
    socialLinks: socialsRes.count ?? 0
  };
}

export async function listAdminProducts() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug), hubs(name, slug)")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAdminProductById(id: string) {
  const supabase = createSupabaseServiceClient();
  const [productRes, specsRes, imagesRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_specs").select("*").eq("product_id", id).order("sort_order"),
    supabase.from("product_images").select("*").eq("product_id", id).order("sort_order")
  ]);

  if (productRes.error) throw productRes.error;
  if (!productRes.data) return null;

  return {
    ...productRes.data,
    specs: specsRes.data ?? [],
    images: imagesRes.data ?? []
  };
}

export async function saveAdminProduct(input: UpsertProductInput) {
  const supabase = createSupabaseServiceClient();
  const productPayload = {
    title: input.title,
    slug: input.slug,
    short_description: input.short_description,
    long_description: input.long_description ?? null,
    category_id: input.category_id ?? null,
    hub_id: input.hub_id ?? null,
    hero_image: input.hero_image ?? null,
    tags: input.tags,
    cta_label: input.cta_label ?? null,
    cta_link: input.cta_link ?? null,
    sort_order: input.sort_order,
    status: input.status,
    featured: input.featured,
    seo_title: input.seo_title ?? null,
    seo_description: input.seo_description ?? null
  };

  const productRes = input.id
    ? await supabase.from("products").update(productPayload).eq("id", input.id).select("*").single()
    : await supabase.from("products").insert(productPayload).select("*").single();

  if (productRes.error) throw productRes.error;

  const productId = productRes.data.id;

  await supabase.from("product_specs").delete().eq("product_id", productId);
  await supabase.from("product_images").delete().eq("product_id", productId);

  if (input.specs.length > 0) {
    const { error } = await supabase.from("product_specs").insert(
      input.specs.map((spec, index) => ({
        product_id: productId,
        label: spec.label,
        value: spec.value,
        sort_order: spec.sort_order ?? index
      }))
    );
    if (error) throw error;
  }

  if (input.images.length > 0) {
    const { error } = await supabase.from("product_images").insert(
      input.images.map((image, index) => ({
        product_id: productId,
        image_url: image.image_url,
        alt_text: image.alt_text ?? null,
        sort_order: image.sort_order ?? index,
        is_hero: image.is_hero
      }))
    );
    if (error) throw error;
  }

  return productRes.data;
}

export async function deleteAdminProduct(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function listAdminCategories() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, hubs(name, slug)")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAdminCategoryById(id: string) {
  const supabase = createSupabaseServiceClient();
  const [categoryRes, stepsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("id", id).maybeSingle(),
    supabase.from("category_process_steps").select("*").eq("category_id", id).order("step_number")
  ]);

  if (categoryRes.error) throw categoryRes.error;
  if (!categoryRes.data) return null;

  return {
    ...categoryRes.data,
    process_steps: stepsRes.data ?? []
  };
}

export async function saveAdminCategory(input: UpsertCategoryInput) {
  const supabase = createSupabaseServiceClient();
  const categoryPayload = {
    hub_id: input.hub_id ?? null,
    name: input.name,
    slug: input.slug,
    short_description: input.short_description,
    hero_title: input.hero_title,
    hero_subtitle: input.hero_subtitle,
    hero_badge: input.hero_badge,
    hero_image: input.hero_image ?? null,
    portfolio_section_title: input.portfolio_section_title,
    portfolio_section_subtitle: input.portfolio_section_subtitle,
    process_section_title: input.process_section_title,
    process_section_subtitle: input.process_section_subtitle,
    inquiry_section_title: input.inquiry_section_title,
    inquiry_section_subtitle: input.inquiry_section_subtitle,
    sort_order: input.sort_order,
    status: input.status,
    seo_title: input.seo_title ?? null,
    seo_description: input.seo_description ?? null
  };

  const categoryRes = input.id
    ? await supabase.from("categories").update(categoryPayload).eq("id", input.id).select("*").single()
    : await supabase.from("categories").insert(categoryPayload).select("*").single();

  if (categoryRes.error) throw categoryRes.error;

  const categoryId = categoryRes.data.id;
  await supabase.from("category_process_steps").delete().eq("category_id", categoryId);

  if (input.process_steps.length > 0) {
    const { error } = await supabase.from("category_process_steps").insert(
      input.process_steps.map((step) => ({
        category_id: categoryId,
        step_number: step.step_number,
        title: step.title,
        description: step.description,
        icon_key: step.icon_key ?? null
      }))
    );

    if (error) throw error;
  }

  return categoryRes.data;
}

export async function deleteAdminCategory(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function listAdminHubs() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("hubs").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveAdminHub(input: {
  id?: string;
  name: string;
  slug: string;
  nav_label: string;
  short_description: string;
  highlight_text: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  card_image?: string | null;
  sort_order: number;
  is_active: boolean;
}) {
  const supabase = createSupabaseServiceClient();
  const payload = {
    name: input.name,
    slug: input.slug,
    nav_label: input.nav_label,
    short_description: input.short_description,
    highlight_text: input.highlight_text,
    hero_title: input.hero_title ?? null,
    hero_subtitle: input.hero_subtitle ?? null,
    card_image: input.card_image ?? null,
    sort_order: input.sort_order,
    is_active: input.is_active
  };

  const res = input.id
    ? await supabase.from("hubs").update(payload).eq("id", input.id).select("*").single()
    : await supabase.from("hubs").insert(payload).select("*").single();

  if (res.error) throw res.error;
  return res.data;
}

export async function deleteAdminHub(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("hubs").delete().eq("id", id);
  if (error) throw error;
}

export async function listAdminSocialLinks() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("social_links").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function saveAdminSocialLink(input: {
  id?: string;
  platform: string;
  label: string;
  url: string;
  is_active: boolean;
  sort_order: number;
}) {
  const supabase = createSupabaseServiceClient();
  const payload = {
    platform: input.platform,
    label: input.label,
    url: input.url,
    is_active: input.is_active,
    sort_order: input.sort_order
  };
  const res = input.id
    ? await supabase.from("social_links").update(payload).eq("id", input.id).select("*").single()
    : await supabase.from("social_links").insert(payload).select("*").single();
  if (res.error) throw res.error;
  return res.data;
}

export async function deleteAdminSocialLink(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw error;
}

export async function getAdminSiteSettings() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveAdminSiteSettings(payload: Record<string, unknown>) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...payload }, { onConflict: "id" });
  if (error) throw error;
}

export async function getAdminHomepageContent() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("homepage_content").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveAdminHomepageContent(payload: Record<string, unknown>) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("homepage_content").upsert({ id: 1, ...payload }, { onConflict: "id" });
  if (error) throw error;
}

export async function getAdminContactContent() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("contact_content").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveAdminContactContent(payload: Record<string, unknown>) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("contact_content").upsert({ id: 1, ...payload }, { onConflict: "id" });
  if (error) throw error;
}
