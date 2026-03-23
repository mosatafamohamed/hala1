alter table public.site_settings add column if not exists logo_url text;
alter table public.site_settings add column if not exists logo_alt text;
alter table public.site_settings add column if not exists logo_width integer;
alter table public.site_settings add column if not exists logo_height integer;
