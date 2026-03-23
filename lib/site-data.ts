import { categories as fallbackCategories } from "@/data/categories";
import { companyInfo as fallbackCompanyInfo } from "@/data/company";
import { hubs as fallbackHubs } from "@/data/hubs";
import { products as fallbackProducts } from "@/data/products";
import { getPublicSiteContent } from "@/lib/cms/public";
import { Product } from "@/lib/types";

export {
  fallbackCategories as categories,
  fallbackCompanyInfo as companyInfo,
  fallbackHubs as hubs,
  fallbackProducts as products
};

export async function getSiteContent() {
  return getPublicSiteContent();
}

export async function getCompanyInfo() {
  const content = await getPublicSiteContent();
  return content.companyInfo;
}

export async function getHubs() {
  const content = await getPublicSiteContent();
  return content.hubs;
}

export async function getCategories() {
  const content = await getPublicSiteContent();
  return content.categories;
}

export async function getProducts() {
  const content = await getPublicSiteContent();
  return content.products.map(normalizeProduct);
}

export async function getHubById(hubId: string) {
  const hubs = await getHubs();
  return hubs.find((hub) => hub.id === hubId);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getProductsByCategory(slug: string) {
  const products = await getProducts();
  return products
    .filter((product) => product.categorySlug === slug)
    .sort(sortProductsForDisplay);
}

export async function getCategoriesByHub(hubId: string) {
  const categories = await getCategories();
  return categories.filter((category) => category.hubId === hubId);
}

export async function getHomepageContent() {
  const content = await getPublicSiteContent();
  return content.homepage;
}

export async function getContactContent() {
  const content = await getPublicSiteContent();
  return content.contact;
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 3) {
  const products = await getProducts();
  return products
    .filter((candidate) => candidate.id !== product.id && candidate.categorySlug === product.categorySlug)
    .sort(sortProductsForDisplay)
    .slice(0, limit);
}

export function sortProductsForDisplay(a: Product, b: Product) {
  if (Boolean(a.featured) !== Boolean(b.featured)) {
    return a.featured ? -1 : 1;
  }

  const sortA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
  const sortB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
  if (sortA !== sortB) {
    return sortA - sortB;
  }

  return a.name.localeCompare(b.name);
}

function normalizeProduct(product: Product): Product {
  const slug =
    product.slug ??
    product.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [{ url: product.image, alt: product.name, isHero: true }];

  return {
    ...product,
    slug,
    gallery,
    specs: product.specs ?? [],
    ctaLabel: product.ctaLabel ?? "View Details",
    ctaLink: product.ctaLink ?? "/contact",
    featured: Boolean(product.featured),
    sortOrder: product.sortOrder ?? 0,
    seoTitle: product.seoTitle ?? product.name,
    seoDescription: product.seoDescription ?? product.description
  };
}
