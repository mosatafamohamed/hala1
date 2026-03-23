export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { deleteAdminSocialLink, saveAdminSocialLink } from "@/lib/cms/admin";
import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";

type SocialRouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: SocialRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const socialLink = await saveAdminSocialLink({ ...payload, id: params.id });
    return NextResponse.json({ data: socialLink });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update social link", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: SocialRouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    await deleteAdminSocialLink(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete social link", detail: String(error) }, { status: 500 });
  }
}
