import { CategoryEditor } from "@/app/admin/_components/category-editor";
import { listAdminHubs } from "@/lib/cms/admin";

export default async function AdminNewCategoryPage() {
  const hubs = await listAdminHubs();

  return <CategoryEditor hubs={hubs.map((hub) => ({ id: hub.id, name: hub.name }))} />;
}
