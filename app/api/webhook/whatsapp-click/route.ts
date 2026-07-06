import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";

export async function POST(req: NextRequest) {
  let body: { landingPageId?: string; destinationPhone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "גוף הבקשה אינו תקין" }, { status: 400 });
  }

  try {
    await fetch(`${BACKEND_URL}/api/webhook/whatsapp-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // fire-and-forget — don't block the user if tracking fails
  }

  return NextResponse.json({ ok: true });
}
