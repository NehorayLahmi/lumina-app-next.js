import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { BACKEND_URL as BACKEND } from "@/lib/config";

// Proxy helper for authenticated PRO → backend calls.
// path is relative to /api/pros (e.g. "/:proId/landing-pages")
export async function proProxy(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND}/api/pros${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init?.headers as Record<string, string> | undefined),
      },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "שגיאת חיבור לשרת" }, { status: 503 });
  }
}
