import { revalidatePath, revalidateTag } from "next/cache";

export const CMS_PUBLIC_REVALIDATE_SECONDS = 60;
export const CMS_PUBLIC_SITE_CACHE_TAG = "cms:public-site";

export function revalidatePublicCmsData() {
  revalidateTag(CMS_PUBLIC_SITE_CACHE_TAG);
}

export function revalidateCatalogRoutes() {
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/category/[slug]", "page");
}

export function revalidateContactRoute() {
  revalidatePath("/contact");
}

export function revalidateSharedPublicRoutes() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidateContactRoute();
  revalidateCatalogRoutes();
}

export function revalidateMaintenanceRoute() {
  revalidatePath("/maintenance");
}
