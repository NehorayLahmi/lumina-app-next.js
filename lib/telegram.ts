const API = "https://api.telegram.org";

export async function sendTelegram(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return;
  try {
    await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch {
    // non-critical — don't fail the request if Telegram is down
  }
}

export function buildLeadMessage(p: {
  clientName: string;
  clientPhone: string;
  city: string;
  profession: string;
}) {
  return (
    `🔔 <b>ליד חדש הגיע!</b>\n\n` +
    `👤 <b>שם לקוח:</b> ${p.clientName}\n` +
    `📞 <b>טלפון:</b> ${p.clientPhone}\n` +
    `📍 <b>עיר:</b> ${p.city}\n` +
    `🛠 <b>שירות:</b> ${p.profession}`
  );
}

export function buildCallMessage(p: {
  callerPhone: string;
  city: string;
  profession: string;
}) {
  return (
    `📞 <b>שיחה נכנסת!</b>\n\n` +
    `📱 <b>מתקשר:</b> ${p.callerPhone}\n` +
    `📍 <b>עיר:</b> ${p.city}\n` +
    `🛠 <b>שירות:</b> ${p.profession}`
  );
}
