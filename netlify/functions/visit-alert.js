
// Discord visit notifier
exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, body: 'ok: visit-alert live' };
  }
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return { statusCode: 500, body: 'Missing DISCORD_WEBHOOK_URL env var' };
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  const ua = (event.headers && (event.headers['user-agent'] || event.headers['User-Agent'])) || '';
  const content = `👀 **New Visit**
• URL: ${body.url || ''}
• Referrer: ${body.referrer || ''}
• UA: ${ua}
• Time: ${body.ts || new Date().toISOString()} (${body.tz || ''})`;
  try {
    const res = await fetch(webhook, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ content }) });
    if (!res.ok) throw new Error(`Discord ${res.status}`);
  } catch (e) {
    return { statusCode: 502, body: `Discord error: ${e.message}` };
  }
  return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: 'ok' };
};
