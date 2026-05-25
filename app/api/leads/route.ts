import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { sendTelegram, buildLeadMessage } from "@/lib/telegram";

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

  if (backendRes.ok) {
    // data.telegramChatId — the backend should return this field from the matched pro
    const chatId: string | undefined = data.telegramChatId ?? data.pro?.telegramChatId;
    const fallbackChatId = process.env.TELEGRAM_CHAT_ID;
    const targetChatId = chatId || fallbackChatId;

    if (targetChatId) {
      sendTelegram(targetChatId, buildLeadMessage({ clientName, clientPhone, city: city!, profession: profession! }));
    }
  }

  return NextResponse.json(data, { status: backendRes.status });
}
