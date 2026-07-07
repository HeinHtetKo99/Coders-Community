import { NextResponse } from "next/server";

export function apiRouteDisabled() {
  return NextResponse.json(
    { success: false, message: "This endpoint is not available" },
    { status: 403 }
  );
}
