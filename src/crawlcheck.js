'use strict';
const { normalizeUrl } = require('./security');

async function fetchText(url, timeoutMs = 8000) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { 'user-agent': 'arianstack-cli' } });
  return { ok: res.ok, status: res.status, text: res.ok ? await res.text() : '' };
}

async function checkRobotsAndSitemap(target) {
  const base = normalizeUrl(target);
  const robotsUrl = new URL('/robots.txt', base).href;
  const sitemapUrl = new URL('/sitemap.xml', base).href;
  const [robots, sitemap] = await Promise.all([fetchText(robotsUrl), fetchText(sitemapUrl)]);
  return {
    robots: { url: robotsUrl, found: robots.ok, preview: robots.ok ? robots.text.slice(0, 600) : null },
    sitemap: { url: sitemapUrl, found: sitemap.ok, preview: sitemap.ok ? sitemap.text.slice(0, 600) : null },
  };
}

module.exports = { checkRobotsAndSitemap };
