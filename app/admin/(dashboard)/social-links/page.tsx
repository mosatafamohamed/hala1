import { SocialLinksManager } from "@/app/admin/_components/social-links-manager";
import { listAdminSocialLinks } from "@/lib/cms/admin";

export default async function AdminSocialLinksPage() {
  const socialLinks = await listAdminSocialLinks();
  return <SocialLinksManager initialLinks={socialLinks} />;
}
