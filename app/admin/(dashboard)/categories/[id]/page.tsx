import { notFound } from "next/navigation";

import { CategoryEditor } from "@/app/admin/_components/category-editor";
import { getAdminCategoryById, listAdminHubs } from "@/lib/cms/admin";

type CategoryEditorPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminCategoryEditorPage({ params }: CategoryEditorPageProps) {
  const [category, hubs] = await Promise.all([getAdminCategoryById(params.id), listAdminHubs()]);

  if (!category) {
    notFound();
  }

  return (
    <CategoryEditor
      categoryId={params.id}
      initialValue={category}
      hubs={hubs.map((hub) => ({ id: hub.id, name: hub.name }))}
    />
  );
}
