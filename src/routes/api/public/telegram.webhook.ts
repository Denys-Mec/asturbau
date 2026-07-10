import { createFileRoute } from "@tanstack/react-router";
import { sendTelegramMessage, deleteTelegramMessage } from "@/lib/notify.server";

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) return new Response("not configured", { status: 500 });

        // Простий захист: Telegram присилає секрет у заголовку, що ми задали при setWebhook.
        const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
        if (expected) {
          const got = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
          if (got !== expected) return new Response("unauthorized", { status: 401 });
        }

        const update = await request.json().catch(() => null);
        const message = update?.message ?? update?.edited_message;
        if (!message?.chat?.id) return Response.json({ ok: true });

        const chatId: number = message.chat.id;
        const messageId: number | undefined = message.message_id;
        const text: string = (message.text ?? "").trim();
        const from = message.from ?? {};
        const displayName = [from.first_name, from.last_name].filter(Boolean).join(" ") || from.username || "Без імені";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (text === "/start") {
          await sendTelegramMessage(
            chatId,
            "Привіт! Щоб отримувати сповіщення про нові заявки Asturbau, надішліть кодове слово, яке вам дав адміністратор.",
          );
          return Response.json({ ok: true });
        }

        if (text === "/stop") {
          await supabaseAdmin.from("notification_recipients").update({ active: false }).eq("chat_id", chatId);
          await sendTelegramMessage(chatId, "Готово. Ви більше не отримуватимете сповіщення.");
          return Response.json({ ok: true });
        }

        // Перевіряємо кодове слово
        const { data: settings } = await supabaseAdmin.from("bot_settings").select("password").eq("id", true).maybeSingle();
        const password = settings?.password?.trim();

        if (password && text && text === password) {
          // Зберігаємо отримувача (upsert по chat_id)
          await supabaseAdmin
            .from("notification_recipients")
            .upsert(
              { chat_id: chatId, name: displayName, active: true },
              { onConflict: "chat_id" },
            );

          // Видаляємо повідомлення з паролем
          if (messageId) await deleteTelegramMessage(chatId, messageId);

          await sendTelegramMessage(
            chatId,
            `✅ Вітаю, ${displayName}!\nВи підписані на сповіщення про нові заявки.\n\nЩоб відписатись — надішліть /stop`,
          );
          return Response.json({ ok: true });
        }

        // Невідома команда / неправильний пароль
        await sendTelegramMessage(chatId, "Невірне кодове слово. Зверніться до адміністратора.");
        return Response.json({ ok: true });
      },
    },
  },
});
