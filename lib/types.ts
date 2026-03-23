export type CompanyInfo = {
  name: string;
  brandLabel?: string;
  tagline: string;
  executiveStatement: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: {
    label: string;
    href: string;
  };
  socialLinks: Array<{
    label: string;
    href: string;
  }>;
  businessHours: Array<{
    day: string;
    hours: string;
  }>;
  stats: Array<{
    label: string;
    value: string;
  }>;
  trustCues: string[];
  logo?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
};

export type Hub = {
  id: string;
  name: string;
  navLabel: string;
  description: string;
  highlight: string;
  image: string;
  href: string;
  categories: string[];
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type Category = {
  slug: string;
  hubId: string;
  name: string;
  badge: string;
  subtitle: string;
  preview: string;
  heroImage: string;
  portfolioTitle?: string;
  portfolioIntro: string;
  processTitle?: string;
  processSubtitle?: string;
  inquiryHeading: string;
  inquiryDescription: string;
  operationSteps: ProcessStep[];
};

export type Product = {
  id: string;
  slug?: string;
  categorySlug: string;
  categoryName?: string;
  hubId?: string;
  hubName?: string;
  name: string;
  origin: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: Array<{
    id?: string;
    url: string;
    alt?: string;
    isHero?: boolean;
    sortOrder?: number;
  }>;
  specs?: Array<{
    id?: string;
    label: string;
    value: string;
    sortOrder?: number;
  }>;
  tags: string[];
  ctaLabel?: string;
  ctaLink?: string;
  featured?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
};
