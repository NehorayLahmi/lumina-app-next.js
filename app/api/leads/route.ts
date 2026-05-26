import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";

export async function POST(req: NextRequest) {
  let body: { clientName?: string; clientPhone?: string; city?: string; profession?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "גוף הבקשה אינו תקין" }, { status: 400 });
  }

  const { clientName, clientPhone, city, profession } = body;
  if (!clientName || !clientPhone || !city || !profession) {
    return NextResponse.json(
      { message: "שדות חסרים: שם, טלפון, עיר ומקצוע הם שדות חובה" },
      { status: 400 }
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/webhook/form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName, clientPhone, city, profession }),
    });
  } catch {
    return NextResponse.json(
      { message: "שגיאת חיבור לשרת — נסה שוב מאוחר יותר" },
      { status: 503 }
    );
  }

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
