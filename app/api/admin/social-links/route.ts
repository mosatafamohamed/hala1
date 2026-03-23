export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { listAdminSocialLinks, saveAdminSocialLink } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const socialLinks = await listAdminSocialLinks();
    return NextResponse.json({ data: socialLinks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch social links", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const socialLink = await saveAdminSocialLink(payload);
    return NextResponse.json({ data: socialLink });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save social link", detail: String(error) }, { status: 500 });
  }
}

