import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { BACKEND_URL as BACKEND } from "@/lib/config";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "גישה נדחתה" }, { status: 403 });
  }
  try {
    const res = await fetch(`${BACKEND}/api/pros/${id}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "שגיאת חיבור לשרת" }, { status: 503 });
  }
}
