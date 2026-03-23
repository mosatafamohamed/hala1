-- 1Hala CMS schema
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.hubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  nav_label text not null,
  short_description text not null,
  highlight_text text not null,
  hero_title text,
  hero_subtitle text,
  card_image text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  hub_id uuid references public.hubs(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text not null,
  hero_title text not null,
  hero_subtitle text not null,
  hero_badge text not null,
  hero_image text,
  portfolio_section_title text not null,
  portfolio_section_subtitle text not null,
  process_section_title text not null,
  process_section_subtitle text not null,
  inquiry_section_title text not null,
  inquiry_section_subtitle text not null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.category_process_steps (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  step_number integer not null,
  title text not null,
  description text not null,
  icon_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, step_number)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  long_description text,
  category_id uuid references public.categories(id) on delete set null,
  hub_id uuid references public.hubs(id) on delete set null,
  hero_image text,
  tags text[] not null default '{}',
  cta_label text,
  cta_link text,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_hero boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1,
  company_display_name text not null,
  brand_label text not null,
  logo_url text,
  logo_alt text,
  logo_width integer,
  logo_height integer,
  topbar_address text not null,
  email text not null,
  phone text not null,
  whatsapp_number text not null,
  whatsapp_url text not null,
  footer_summary text not null,
  footer_trust_line text not null,
  global_copyright_text text not null,
  official_registration_label text,
  hero_trust_metrics text[] not null default '{}',
  default_primary_cta_label text,
  default_secondary_cta_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (id = 1)
);

alter table public.site_settings add column if not exists logo_url text;
alter table public.site_settings add column if not exists logo_alt text;
alter table public.site_settings add column if not exists logo_width integer;
alter table public.site_settings add column if not exists logo_height integer;

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_content (
  id integer primary key default 1,
  hero_badge text not null,
  hero_title text not null,
  hero_subtitle text not null,
  hero_metrics_line text,
  hero_primary_cta_label text,
  hero_primary_cta_link text,
  hero_secondary_cta_label text,
  hero_secondary_cta_link text,
  hero_trust_chips text[] not null default '{}',
  hubs_eyebrow text,
  hubs_title text,
  hubs_subtitle text,
  category_preview_eyebrow text,
  category_preview_title text,
  category_preview_subtitle text,
  stats_section_title text,
  stats_items jsonb not null default '[]'::jsonb,
  social_section_title text,
  footer_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (id = 1)
);

create table if not exists public.contact_content (
  id integer primary key default 1,
  page_title text not null,
  subtitle text not null,
  registered_address text not null,
  phone text not null,
  email text not null,
  business_hours jsonb not null default '[]'::jsonb,
  primary_cta_label text,
  secondary_cta_label text,
  inquiry_helper_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (id = 1)
);

create index if not exists idx_hubs_sort on public.hubs(sort_order);
create index if not exists idx_categories_hub on public.categories(hub_id);
create index if not exists idx_categories_status_sort on public.categories(status, sort_order);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_status_sort on public.products(status, sort_order);
create index if not exists idx_social_links_sort on public.social_links(sort_order);

drop trigger if exists trg_hubs_updated_at on public.hubs;
create trigger trg_hubs_updated_at before update on public.hubs
for each row execute function public.set_updated_at();

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_category_process_steps_updated_at on public.category_process_steps;
create trigger trg_category_process_steps_updated_at before update on public.category_process_steps
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_product_specs_updated_at on public.product_specs;
create trigger trg_product_specs_updated_at before update on public.product_specs
for each row execute function public.set_updated_at();

drop trigger if exists trg_product_images_updated_at on public.product_images;
create trigger trg_product_images_updated_at before update on public.product_images
for each row execute function public.set_updated_at();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_social_links_updated_at on public.social_links;
create trigger trg_social_links_updated_at before update on public.social_links
for each row execute function public.set_updated_at();

drop trigger if exists trg_homepage_content_updated_at on public.homepage_content;
create trigger trg_homepage_content_updated_at before update on public.homepage_content
for each row execute function public.set_updated_at();

drop trigger if exists trg_contact_content_updated_at on public.contact_content;
create trigger trg_contact_content_updated_at before update on public.contact_content
for each row execute function public.set_updated_at();

alter table public.hubs enable row level security;
alter table public.categories enable row level security;
alter table public.category_process_steps enable row level security;
alter table public.products enable row level security;
alter table public.product_specs enable row level security;
alter table public.product_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.homepage_content enable row level security;
alter table public.contact_content enable row level security;

drop policy if exists "Public read active hubs" on public.hubs;
create policy "Public read active hubs" on public.hubs
for select using (is_active = true);

drop policy if exists "Public read published categories" on public.categories;
create policy "Public read published categories" on public.categories
for select using (status = 'published');

drop policy if exists "Public read process steps for published categories" on public.category_process_steps;
create policy "Public read process steps for published categories" on public.category_process_steps
for select using (
  exists (
    select 1 from public.categories c
    where c.id = category_process_steps.category_id and c.status = 'published'
  )
);

drop policy if exists "Public read published products" on public.products;
create policy "Public read published products" on public.products
for select using (status = 'published');

drop policy if exists "Public read specs for published products" on public.product_specs;
create policy "Public read specs for published products" on public.product_specs
for select using (
  exists (
    select 1 from public.products p
    where p.id = product_specs.product_id and p.status = 'published'
  )
);

drop policy if exists "Public read product images for published products" on public.product_images;
create policy "Public read product images for published products" on public.product_images
for select using (
  exists (
    select 1 from public.products p
    where p.id = product_images.product_id and p.status = 'published'
  )
);

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings" on public.site_settings
for select using (true);

drop policy if exists "Public read active social links" on public.social_links;
create policy "Public read active social links" on public.social_links
for select using (is_active = true);

drop policy if exists "Public read homepage content" on public.homepage_content;
create policy "Public read homepage content" on public.homepage_content
for select using (true);

drop policy if exists "Public read contact content" on public.contact_content;
create policy "Public read contact content" on public.contact_content
for select using (true);
