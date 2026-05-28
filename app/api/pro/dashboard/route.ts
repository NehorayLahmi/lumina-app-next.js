import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { BACKEND_URL as BACKEND } from "@/lib/config";

export async function GET() {
  const user = await getAuthUser();
  if (!user?.proProfileId) {
    return NextResponse.json({ message: "לא מחובר" }, { status: 401 });
  }
  try {
    const res = await fetch(`${BACKEND}/api/pros/${user.proProfileId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      // Pro was deleted or no longer exists — clear session
      const response = NextResponse.json({ message: "המשתמש לא קיים במערכת" }, { status: 401 });
      response.cookies.delete("auth_token");
      return response;
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "שגיאת חיבור לשרת" }, { status: 503 });
  }
}
