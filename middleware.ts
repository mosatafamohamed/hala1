import { NextResponse, type NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const maintenanceModeEnabled = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (pathname.startsWith("/admin")) {
    return updateSupabaseSession(request);
  }

  if (
    maintenanceModeEnabled &&
    !pathname.startsWith("/api") &&
    pathname !== "/maintenance"
  ) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";
    maintenanceUrl.search = "";
    return NextResponse.redirect(maintenanceUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"]
};
