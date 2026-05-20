import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { proProxy } from "@/lib/proFetch";

// PUT /api/pro/landing-pages/:id  — save CMS edits (text + image URLs)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    const { NextResponse } = await import("next/server");
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  return proProxy(`/${user.proProfileId}/landing-pages/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
