import { notFound } from "next/navigation";

import { ProductEditor } from "@/app/admin/_components/product-editor";
import { getAdminProductById, listAdminCategories, listAdminHubs } from "@/lib/cms/admin";

type ProductEditorPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminProductEditorPage({ params }: ProductEditorPageProps) {
  const [product, categories, hubs] = await Promise.all([
    getAdminProductById(params.id),
    listAdminCategories(),
    listAdminHubs()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductEditor
      productId={params.id}
      initialValue={product}
      categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      hubs={hubs.map((hub) => ({ id: hub.id, name: hub.name }))}
    />
  );
}
