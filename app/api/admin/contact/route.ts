export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { getAdminContactContent, saveAdminContactContent } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const contactContent = await getAdminContactContent();
    return NextResponse.json({ data: contactContent });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact content", detail: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    await saveAdminContactContent(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save contact content", detail: String(error) }, { status: 500 });
  }
}

