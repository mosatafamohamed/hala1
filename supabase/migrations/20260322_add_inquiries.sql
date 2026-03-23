create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text not null,
  work_email text not null,
  phone_number text,
  area_of_interest text not null,
  inquiry_details text not null,
  source_page text,
  product_name text,
  category_name text,
  email_status text not null default 'sent' check (email_status in ('sent', 'failed')),
  email_error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);
create index if not exists idx_inquiries_email_status on public.inquiries(email_status);
