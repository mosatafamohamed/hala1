export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import {
  revalidateMaintenanceRoute,
  revalidatePublicCmsData,
  revalidateSharedPublicRoutes
} from "@/lib/cms/revalidation";
import { getAdminSiteSettings, saveAdminSiteSettings } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const settings = await getAdminSiteSettings();
    return NextResponse.json({ data: settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch site settings", detail: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    await saveAdminSiteSettings(payload);
    revalidatePublicCmsData();
    revalidateSharedPublicRoutes();
    revalidateMaintenanceRoute();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save site settings", detail: String(error) }, { status: 500 });
  }
}

