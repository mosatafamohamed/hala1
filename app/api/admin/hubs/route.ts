export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { revalidatePublicCmsData, revalidateSharedPublicRoutes } from "@/lib/cms/revalidation";
import { listAdminHubs, saveAdminHub } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const hubs = await listAdminHubs();
    return NextResponse.json({ data: hubs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hubs", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const hub = await saveAdminHub(payload);
    revalidatePublicCmsData();
    revalidateSharedPublicRoutes();
    return NextResponse.json({ data: hub });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save hub", detail: String(error) }, { status: 500 });
  }
}

