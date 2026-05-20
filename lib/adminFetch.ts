import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function adminProxy(
  path: string,
  init?: RequestInit
): Promise<Response | NextResponse> {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "גישה נדחתה" }, { status: 403 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND}/api/admin${path}`, {
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
}
