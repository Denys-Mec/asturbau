interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

export async function sendTelegramMessage(chatId: number | string, text: string, extra?: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, error: "no_token" };
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", ...extra }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[telegram] sendMessage error", res.status, body);
  }
  return { ok: res.ok };
}

export async function deleteTelegramMessage(chatId: number | string, messageId: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  }).catch(() => {});
}

export async function notifyNewLead(lead: LeadPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("[notify] Telegram not configured — lead saved only to DB");
    return;
  }

  const text =
    `🔔 *Нова заявка — Asturbau*\n\n` +
    `👤 ${lead.name}\n` +
    `📞 ${lead.phone}\n` +
    (lead.email ? `✉️ ${lead.email}\n` : "") +
    (lead.message ? `\n💬 ${lead.message}` : "");

  // Збираємо отримувачів: спершу з БД, інакше fallback на TELEGRAM_CHAT_ID
  const recipients: (number | string)[] = [];
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("notification_recipients")
      .select("chat_id")
      .eq("active", true);
    if (data && data.length > 0) {
      for (const r of data) recipients.push(r.chat_id as unknown as number);
    }
  } catch (e) {
    console.error("[notify] failed to load recipients", e);
  }

  if (recipients.length === 0) {
    console.log("[notify] No active recipients — skipping Telegram notification");
    return;
  }

  await Promise.all(recipients.map((id) => sendTelegramMessage(id, text)));
}
