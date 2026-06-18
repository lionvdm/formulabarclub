const REDIS_URL = process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
const KEY = "formula_bar_partner_state_v6";

export default async function handler(req, res) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    res.status(500).json({
      error: "Хранилище не настроено. Добавьте переменные окружения KV_REST_API_URL и KV_REST_API_TOKEN в настройках проекта на Vercel."
    });
    return;
  }

  try {
    if (req.method === "GET") {
      const upstreamResponse = await fetch(`${REDIS_URL}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
      });
      const data = await upstreamResponse.json();
      res.status(200).json({ value: data.result || null });
      return;
    }

    if (req.method === "POST") {
      const value = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const upstreamResponse = await fetch(`${REDIS_URL}/set/${KEY}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
        body: value
      });
      if (!upstreamResponse.ok) {
        res.status(502).json({ error: "Не удалось сохранить данные в хранилище." });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: "Внутренняя ошибка сервера", details: String(error) });
  }
}
