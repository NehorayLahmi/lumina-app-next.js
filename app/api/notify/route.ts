import { NextRequest, NextResponse } from "next/server";
import { sendTelegram, buildLeadMessage, buildCallMessage } from "@/lib/telegram";

/**
 * Called by the backend after a lead or call is processed.
 * Body: { secret, type: "lead"|"call", telegramChatId, ...event data }
 */
export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const secret = process.env.NOTIFY_SECRET;
  if (secret && body.secret !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const chatId: string | undefined = body.telegramChatId || process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return NextResponse.json({ ok: false, reason: "no chatId" }, { status: 422 });

  if (body.type === "lead") {
    await sendTelegram(
      chatId,
      buildLeadMessage({
        clientName: body.clientName,
        clientPhone: body.clientPhone,
        city: body.city,
        profession: body.profession,
      })
    );
  } else if (body.type === "call") {
    await sendTelegram(
      chatId,
      buildCallMessage({
        callerPhone: body.callerPhone ?? "לא ידוע",
        city: body.city,
        profession: body.profession,
      })
    );
  } else {
    return NextResponse.json({ ok: false, reason: "unknown type" }, { status: 422 });
  }

  return NextResponse.json({ ok: true });
}



