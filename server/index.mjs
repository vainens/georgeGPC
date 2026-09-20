import { createServer } from 'node:http';

const port = Number(process.env.AI_PORT || 8787);
const hostname = process.env.AI_HOST || '127.0.0.1';
const apiKey = process.env.OPENAI_API_KEY;
const baseUrl = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const modelMap = {
  'gpc-1-lite': process.env.GPC_LITE_MODEL || 'gpt-4.1-mini',
  'gpc-1-flash': process.env.GPC_FLASH_MODEL || 'gpt-4.1-mini',
  'gpc-1.5 preview': process.env.GPC_PREVIEW_MODEL || 'gpt-4.1',
};

const systemPrompt = `You are georgeGPC, an accurate, helpful multilingual assistant. Answer in the user's language. Be concise unless depth is requested. Irony is allowed only when the user enabled it and it is never appropriate for safety, health, legal, grief, crisis, or sensitive requests. Do not claim to have tools, private data, or web access unless they are actually supplied.`;

function reply(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; if (body.length > 1_000_000) request.destroy(); });
    request.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('JSON non valido')); } });
    request.on('error', reject);
  });
}

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/api/health') {
    return reply(response, 200, { ready: Boolean(apiKey), provider: baseUrl });
  }
  if (request.method !== 'POST' || request.url !== '/api/chat') return reply(response, 404, { error: 'Route non trovata.' });
  if (!apiKey) return reply(response, 503, { error: 'Provider non configurato. Imposta OPENAI_API_KEY sul server.' });

  try {
    const { messages, profile, irony } = await readJson(request);
    if (!Array.isArray(messages) || messages.length === 0 || !modelMap[profile]) return reply(response, 400, { error: 'Richiesta chat non valida.' });
    const safeMessages = messages.slice(-20).map(({ role, content }) => ({
      role: role === 'assistant' ? 'assistant' : 'user',
      content: String(content || '').slice(0, 12_000),
    })).filter((message) => message.content.trim());
    const providerResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: modelMap[profile],
        messages: [{ role: 'system', content: `${systemPrompt}\nIrony enabled: ${Boolean(irony)}.` }, ...safeMessages],
        temperature: irony ? 0.8 : 0.4,
      }),
    });
    const data = await providerResponse.json();
    if (!providerResponse.ok) return reply(response, providerResponse.status, { error: data?.error?.message || 'Il provider ha rifiutato la richiesta.' });
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return reply(response, 502, { error: 'Il provider non ha restituito testo.' });
    return reply(response, 200, { content, model: modelMap[profile] });
  } catch (error) {
    return reply(response, 500, { error: error.message === 'JSON non valido' ? error.message : 'Errore durante la richiesta al provider.' });
  }
}).listen(port, hostname, () => console.log(`georgeGPC AI server: http://${hostname}:${port}`));
