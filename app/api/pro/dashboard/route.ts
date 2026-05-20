import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function GET() {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }
  try {
    const res = await fetch(`${BACKEND}/api/pros/${user.proProfileId}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "שגיאת חיבור לשרת" }, { status: 503 });
  }
}
