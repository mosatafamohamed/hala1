export const dynamic = "force-dynamic";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, unauthorizedResponse } from "@/lib/supabase/auth";
import { supabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "general");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const extension = file.name.split(".").pop() ?? "bin";
    const path = `${folder}/${randomUUID()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.storage.from(supabaseEnv.storageBucket).upload(path, bytes, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(supabaseEnv.storageBucket).getPublicUrl(path);
    return NextResponse.json({ data: { path, publicUrl: data.publicUrl } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentAdminUser();
  if (!user) return unauthorizedResponse();

  const url = new URL(request.url);
  const path = url.searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.storage.from(supabaseEnv.storageBucket).remove([path]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete file", detail: String(error) }, { status: 500 });
  }
}

