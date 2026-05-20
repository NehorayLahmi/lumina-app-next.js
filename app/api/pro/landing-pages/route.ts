import { getAuthUser } from "@/lib/auth";
import { proProxy } from "@/lib/proFetch";

// GET /api/pro/landing-pages  — returns all landing pages owned by the logged-in pro
export async function GET() {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    const { NextResponse } = await import("next/server");
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }
  return proProxy(`/${user.proProfileId}/landing-pages`);
}
