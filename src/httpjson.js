'use strict';
// Helper to fetch JSON from a URL with a timeout, no external dependencies
async function getJson(url, { timeoutMs = 8000, headers = {} } = {}) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}
module.exports = { getJson };
