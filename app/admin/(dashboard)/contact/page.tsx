import { ContactEditor } from "@/app/admin/_components/contact-editor";
import { getAdminContactContent } from "@/lib/cms/admin";

export default async function AdminContactPage() {
  const contactContent = await getAdminContactContent();
  return <ContactEditor initialValue={contactContent} />;
}
