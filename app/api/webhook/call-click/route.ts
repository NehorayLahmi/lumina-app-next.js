import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";

export async function POST(req: NextRequest) {
  let body: { landingPageId?: string; destinationPhone?: string; callerPhone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "גוף הבקשה אינו תקין" }, { status: 400 });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/webhook/call-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        landingPageId:    body.landingPageId ?? "",
        destinationPhone: body.destinationPhone ?? "",
        callerPhone:      body.callerPhone ?? "",
      }),
    });
    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json({ message: "שגיאת חיבור לשרת" }, { status: 503 });
  }
}
