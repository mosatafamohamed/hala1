import { SiteSettingsEditor } from "@/app/admin/_components/site-settings-editor";
import { getAdminSiteSettings } from "@/lib/cms/admin";

export default async function AdminSiteSettingsPage() {
  const siteSettings = await getAdminSiteSettings();
  return <SiteSettingsEditor initialValue={siteSettings} />;
}
