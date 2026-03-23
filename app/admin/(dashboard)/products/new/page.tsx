import { ProductEditor } from "@/app/admin/_components/product-editor";
import { listAdminCategories, listAdminHubs } from "@/lib/cms/admin";

export default async function AdminNewProductPage() {
  const [categories, hubs] = await Promise.all([listAdminCategories(), listAdminHubs()]);

  return (
    <ProductEditor
      categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      hubs={hubs.map((hub) => ({ id: hub.id, name: hub.name }))}
    />
  );
}
