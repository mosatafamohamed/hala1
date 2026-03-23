export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { deleteAdminCategory, getAdminCategoryById, saveAdminCategory } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

type CategoryRouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: CategoryRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const category = await getAdminCategoryById(params.id);
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: category });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category", detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: CategoryRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const category = await saveAdminCategory({ ...payload, id: params.id });
    return NextResponse.json({ data: category });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: CategoryRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    await deleteAdminCategory(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category", detail: String(error) }, { status: 500 });
  }
}
