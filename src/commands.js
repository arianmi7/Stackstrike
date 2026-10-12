'use strict';
const fmt = require('./format');
const ipMod = require('./ip');
const dnsMod = require('./dns');
const sec = require('./security');
const whoisMod = require('./whois');
const net = require('./network');
const crawl = require('./crawlcheck');

async function guard(fn) {
  try { await fn(); } catch (err) { fmt.fail(err.message || String(err)); }
}

async function cmdMyIp() {
  fmt.title('Your public IP');
  await guard(async () => {
    const ip = await ipMod.myPublicIp();
    fmt.kv('IP', ip);
    const info = await ipMod.lookupIp(ip);
    fmt.kv('Country', `${info.country || '-'} (${info.countryCode || '-'})`);
    fmt.kv('City / Region', `${info.city || '-'} / ${info.region || '-'}`);
    fmt.kv('ISP', info.isp);
    fmt.kv('Timezone', info.timezone);
    fmt.kv('Coordinates', info.lat && info.lon ? `${info.lat}, ${info.lon}` : null);
  });
}

async function cmdIpLookup(target) {
  if (!target) return fmt.fail('Provide an IP or domain. Example: arianstack ip 8.8.8.8');
  fmt.title(`IP / domain info: ${target}`);
  await guard(async () => {
    const info = await ipMod.lookupIp(target);
    fmt.kv('IP', info.ip);
    fmt.kv('Country', `${info.country || '-'} (${info.countryCode || '-'})`);
    fmt.kv('City / Region', `${info.city || '-'} / ${info.region || '-'}`);
    fmt.kv('Postal code', info.postal);
    fmt.kv('ISP / Org', info.isp);
    fmt.kv('ASN', info.asn);
    fmt.kv('Timezone', info.timezone);
    fmt.kv('Approx. coordinates', info.lat && info.lon ? `${info.lat}, ${info.lon}` : null);
    fmt.warn('Coordinates come from an IP geolocation database; usually city-level accuracy, not a person\'s exact location.');
  });
}

async function cmdDns(domain) {
  if (!domain) return fmt.fail('Provide a domain. Example: arianstack dns yamelk.com');
  fmt.title(`DNS records: ${domain}`);
  await guard(async () => {
    const r = await dnsMod.lookupAll(domain);
    if (r.A.length) fmt.kv('A', r.A.join(', '));
    if (r.AAAA.length) fmt.kv('AAAA', r.AAAA.join(', '));
    if (r.CNAME) fmt.kv('CNAME', r.CNAME);
    if (r.MX.length) fmt.kv('MX', r.MX.map((m) => `${m.exchange} (p${m.priority})`).join(', '));
    if (r.NS.length) fmt.kv('NS', r.NS.join(', '));
    if (r.TXT.length) r.TXT.forEach((t, i) => fmt.kv(`TXT[${i}]`, t.length > 80 ? t.slice(0, 80) + '...' : t));
  });
}

async function cmdHeaders(url) {
  if (!url) return fmt.fail('Provide a URL. Example: arianstack headers yamelk.com');
  fmt.title(`Security headers check: ${url}`);
  await guard(async () => {
    const r = await sec.checkSecurityHeaders(url);
    fmt.kv('HTTP status', r.status);
    if (r.server) fmt.kv('Server', r.server);
    if (r.poweredBy) fmt.warn(`X-Powered-By header leaks tech info: ${r.poweredBy}`);
    for (const row of r.rows) {
      if (row.present) fmt.ok(`${row.header} - ${row.desc}`);
      else fmt.fail(`${row.header} not set - ${row.desc}`);
    }
    console.log('');
    fmt.kv('Security header score', `${r.score} / ${r.max}`);
  });
}

async function cmdSsl(url) {
  if (!url) return fmt.fail('Provide a URL. Example: arianstack ssl yamelk.com');
  fmt.title(`SSL certificate: ${url}`);
  await guard(async () => {
    const c = await sec.checkCertificate(url);
    fmt.kv('Issued to', c.subject);
    fmt.kv('Issuer', c.issuer);
    fmt.kv('Protocol', c.protocol);
    fmt.kv('Valid until', c.validTo);
    if (c.daysLeft < 0) fmt.fail(`Certificate expired ${Math.abs(c.daysLeft)} days ago!`);
    else if (c.daysLeft < 14) fmt.warn(`Only ${c.daysLeft} days left before the certificate expires.`);
    else fmt.ok(`${c.daysLeft} days remaining until expiry.`);
    if (c.authorized) fmt.ok('Certificate is trusted by a valid authority.');
    else fmt.fail(`Certificate is not trusted: ${c.authorizationError}`);
  });
}

async function cmdWhois(domain) {
  if (!domain) return fmt.fail('Provide a domain. Example: arianstack whois yamelk.com');
  fmt.title(`WHOIS: ${domain}`);
  await guard(async () => {
    const raw = await whoisMod.whois(domain);
    console.log(raw.split('\n').slice(0, 40).join('\n'));
  });
}

async function cmdPing(host) {
  if (!host) return fmt.fail('Provide a host. Example: arianstack ping yamelk.com');
  fmt.title(`Ping: ${host}`);
  await guard(async () => { const r = await net.ping(host); console.log(r.output); });
}

async function cmdTraceroute(host) {
  if (!host) return fmt.fail('Provide a host. Example: arianstack trace yamelk.com');
  fmt.title(`Traceroute: ${host}`);
  await guard(async () => { console.log(await net.traceroute(host)); });
}

async function cmdPorts(host) {
  if (!host) return fmt.fail('Provide a host. Example: arianstack ports yamelk.com');
  fmt.title(`Common port check: ${host}`);
  fmt.warn('Only use this against systems you are authorized to test.');
  await guard(async () => {
    const results = await net.scanCommonPorts(host);
    for (const r of results) {
      if (r.open) fmt.ok(`${r.port}/${r.name} is open`);
      else fmt.fail(`${r.port}/${r.name} is closed or filtered`);
    }
  });
}

async function cmdRobots(url) {
  if (!url) return fmt.fail('Provide a URL. Example: arianstack robots yamelk.com');
  fmt.title(`robots.txt / sitemap.xml: ${url}`);
  await guard(async () => {
    const r = await crawl.checkRobotsAndSitemap(url);
    if (r.robots.found) { fmt.ok(`robots.txt found: ${r.robots.url}`); console.log(r.robots.preview); }
    else fmt.warn('robots.txt not found.');
    if (r.sitemap.found) fmt.ok(`sitemap.xml found: ${r.sitemap.url}`);
    else fmt.warn('sitemap.xml not found.');
  });
}

async function cmdFullAudit(url) {
  if (!url) return fmt.fail('Provide a URL. Example: arianstack audit yamelk.com');
  await cmdHeaders(url);
  await cmdSsl(url);
  await cmdRobots(url);
}

module.exports = {
  cmdMyIp, cmdIpLookup, cmdDns, cmdHeaders, cmdSsl, cmdWhois,
  cmdPing, cmdTraceroute, cmdPorts, cmdRobots, cmdFullAudit,
};
