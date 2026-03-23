import { CategoriesTable } from "@/app/admin/_components/categories-table";
import { listAdminCategories } from "@/lib/cms/admin";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();
  return <CategoriesTable categories={categories} />;
}
