import { HomepageEditor } from "@/app/admin/_components/homepage-editor";
import { getAdminHomepageContent } from "@/lib/cms/admin";

export default async function AdminHomepagePage() {
  const homepageContent = await getAdminHomepageContent();
  return <HomepageEditor initialValue={homepageContent} />;
}
