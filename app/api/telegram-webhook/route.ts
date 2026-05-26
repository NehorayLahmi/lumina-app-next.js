import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN ?? "";
const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:3001").replace(/\/$/, "");

async function sendMessage(chatId: number, text: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {});
}

interface TelegramUpdate {
  message?: {
    chat?: { id?: number };
    text?: string;
  };
}

export async function POST(req: NextRequest) {
  let body: TelegramUpdate;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = body?.message?.chat?.id;
  const text   = (body?.message?.text ?? "").trim();

  if (!chatId || !text.startsWith("/start")) {
    return NextResponse.json({ ok: true });
  }

  const code = text.slice("/start".length).trim();

  if (!code) {
    await sendMessage(chatId, "שלח את קוד האימות שלך: /start <קוד>");
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/pros/link-telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, chatId: chatId.toString() }),
    });

    if (res.ok) {
      await sendMessage(chatId, "✅ חוברת בהצלחה! תקבל התראות על לידים ושיחות חדשות.");
    } else {
      await sendMessage(chatId, "❌ קוד לא תקין. בדוק שהקוד נכון ונסה שוב.");
    }
  } catch {
    await sendMessage(chatId, "שגיאת שרת — נסה שוב מאוחר יותר.");
  }

  return NextResponse.json({ ok: true });
}
