import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { BACKEND_URL as BACKEND } from "@/lib/config";

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/api/pros/${user.proProfileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "שגיאת חיבור לשרת" }, { status: 503 });
  }
}
