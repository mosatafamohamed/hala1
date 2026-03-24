export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { revalidatePublicCmsData, revalidateSharedPublicRoutes } from "@/lib/cms/revalidation";
import { listAdminCategories, saveAdminCategory } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const categories = await listAdminCategories();
    return NextResponse.json({ data: categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const category = await saveAdminCategory(payload);
    revalidatePublicCmsData();
    revalidateSharedPublicRoutes();
    return NextResponse.json({ data: category });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save category", detail: String(error) }, { status: 500 });
  }
}

