const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    res.status(500).json({
      error: "Бот не настроен. Добавьте переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в настройках проекта на Vercel."
    });
    return;
  }

  try {
    const { trainerName, phone, amount, date } = req.body || {};

    const text = [
      "💰 Заявка на вывод средств",
      "",
      `Партнёр: ${trainerName || "—"}`,
      `Телефон: ${phone || "—"}`,
      `Сумма: ${amount || 0} ₸`,
      `Дата: ${date || "—"}`
    ].join("\n");

    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.text();
      res.status(502).json({ error: "Telegram API error", details: errorBody });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Внутренняя ошибка сервера", details: String(error) });
  }
}
