export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { getAdminHomepageContent, saveAdminHomepageContent } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const homepageContent = await getAdminHomepageContent();
    return NextResponse.json({ data: homepageContent });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch homepage content", detail: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    await saveAdminHomepageContent(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save homepage content", detail: String(error) }, { status: 500 });
  }
}

