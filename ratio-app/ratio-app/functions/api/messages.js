/* Cloudflare Pages Function.
 *
 * The browser must never hold an API key, so the app posts here and this
 * adds the key on the server. Set ANTHROPIC_API_KEY in the Pages project
 * settings (Settings → Variables → Secret). Optionally set APP_TOKEN to
 * refuse requests that do not carry the matching x-app-token header.
 */

const ALLOWED_MODELS = new Set([
  "claude-sonnet-5",
  "claude-opus-5",
  "claude-sonnet-4-5",
  "claude-haiku-4-5-20251001",
]);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: { type: "not_configured", message: "ANTHROPIC_API_KEY is not set on this Pages project." } }, 500);
  }
  if (env.APP_TOKEN && request.headers.get("x-app-token") !== env.APP_TOKEN) {
    return json({ error: { type: "unauthorized", message: "Missing or wrong app token." } }, 401);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: { type: "bad_request", message: "Body was not JSON." } }, 400);
  }

  if (payload.model && !ALLOWED_MODELS.has(payload.model)) {
    return json({ error: { type: "bad_model", message: `Model ${payload.model} is not allowed here.` } }, 400);
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: payload.model || "claude-sonnet-5",
      max_tokens: Math.min(Number(payload.max_tokens) || 1000, 4000),
      messages: payload.messages || [],
    }),
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export const onRequestGet = () =>
  json({ ok: true, note: "Post a messages request here. The app does this for you." });
