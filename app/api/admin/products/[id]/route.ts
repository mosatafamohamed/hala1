export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { revalidateCatalogRoutes, revalidatePublicCmsData } from "@/lib/cms/revalidation";
import { deleteAdminProduct, getAdminProductById, saveAdminProduct } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

type ProductRouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: ProductRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const product = await getAdminProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product", detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: ProductRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const product = await saveAdminProduct({ ...payload, id: params.id });
    revalidatePublicCmsData();
    revalidateCatalogRoutes();
    return NextResponse.json({ data: product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: ProductRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    await deleteAdminProduct(params.id);
    revalidatePublicCmsData();
    revalidateCatalogRoutes();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product", detail: String(error) }, { status: 500 });
  }
}
