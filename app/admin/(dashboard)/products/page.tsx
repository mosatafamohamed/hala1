import { ProductsTable } from "@/app/admin/_components/products-table";
import { listAdminProducts } from "@/lib/cms/admin";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();
  return <ProductsTable products={products} />;
}
