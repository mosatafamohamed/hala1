export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";
import { listAdminProducts, saveAdminProduct } from "@/lib/cms/admin";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const products = await listAdminProducts();
    return NextResponse.json({ data: products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const product = await saveAdminProduct(payload);
    return NextResponse.json({ data: product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save product", detail: String(error) }, { status: 500 });
  }
}

