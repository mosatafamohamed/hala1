export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { deleteAdminHub, saveAdminHub } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

type HubRouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: HubRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const hub = await saveAdminHub({ ...payload, id: params.id });
    return NextResponse.json({ data: hub });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hub", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: HubRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    await deleteAdminHub(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete hub", detail: String(error) }, { status: 500 });
  }
}
