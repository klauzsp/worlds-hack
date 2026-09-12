export const REACTOR_MODEL = 'reactor/fast-h3';
export async function mintReactorToken(apiKey, request = fetch) {
  if (!apiKey) throw new Error('Add REACTOR_API_KEY to .env and restart the server.');
  const response = await request('https://api.reactor.inc/tokens', {
    method: 'POST',
    headers: { 'Reactor-API-Key': apiKey, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      expires_after: 900,
      authorization_details: [{
        type: 'session', resources: { models: { match: [REACTOR_MODEL] } },
        constraints: { max_sessions: 1, max_session_duration_seconds: 600 }
      }]
    })
  });
  if (!response.ok) throw new Error(`Reactor authentication failed (HTTP ${response.status}). Check your key and H3 model access.`);
  const data = await response.json();
  if (typeof data.jwt !== 'string' || !data.jwt) throw new Error('Reactor returned no session token.');
  return { jwt: data.jwt, model: REACTOR_MODEL };
}
