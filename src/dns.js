'use strict';
const dns = require('node:dns').promises;

async function lookupAll(domain) {
  const result = { domain, A: [], AAAA: [], MX: [], TXT: [], NS: [], CNAME: null };
  const tasks = [
    dns.resolve4(domain).then((r) => (result.A = r)).catch(() => {}),
    dns.resolve6(domain).then((r) => (result.AAAA = r)).catch(() => {}),
    dns.resolveMx(domain).then((r) => (result.MX = r.sort((a, b) => a.priority - b.priority))).catch(() => {}),
    dns.resolveTxt(domain).then((r) => (result.TXT = r.map((t) => t.join('')))).catch(() => {}),
    dns.resolveNs(domain).then((r) => (result.NS = r)).catch(() => {}),
    dns.resolveCname(domain).then((r) => (result.CNAME = r[0])).catch(() => {}),
  ];
  await Promise.all(tasks);
  const hasAny = result.A.length || result.AAAA.length || result.MX.length || result.TXT.length || result.NS.length || result.CNAME;
  if (!hasAny) throw new Error('No DNS records found for this domain. Check the spelling.');
  return result;
}

module.exports = { lookupAll };
