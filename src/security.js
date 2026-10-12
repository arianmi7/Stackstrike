'use strict';
const https = require('node:https');
const tls = require('node:tls');

function normalizeUrl(input) {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  return new URL(u);
}

// Fetch HTTP security headers (non-intrusive; a single plain GET, like a browser)
function fetchHeaders(url, { timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: timeoutMs, headers: { 'user-agent': 'arianstack-cli' } }, (res) => {
      res.resume();
      resolve({ status: res.statusCode, headers: res.headers });
    });
    req.on('timeout', () => req.destroy(new Error('Request timed out.')));
    req.on('error', reject);
  });
}

const SECURITY_HEADERS = [
  ['strict-transport-security', 'HSTS - forces HTTPS connections'],
  ['content-security-policy', 'CSP - mitigates XSS / content injection'],
  ['x-content-type-options', 'Prevents MIME-type sniffing by the browser'],
  ['x-frame-options', 'Prevents the site being embedded in a foreign iframe (clickjacking)'],
  ['referrer-policy', 'Controls what Referrer info is sent to other sites'],
  ['permissions-policy', 'Restricts access to camera/microphone/location'],
];

async function checkSecurityHeaders(target) {
  const url = normalizeUrl(target);
  const { status, headers } = await fetchHeaders(url);
  const rows = SECURITY_HEADERS.map(([key, desc]) => ({
    header: key, present: Boolean(headers[key]), value: headers[key] || null, desc,
  }));
  const score = rows.filter((r) => r.present).length;
  return { url: url.href, status, rows, score, max: rows.length, server: headers['server'] || null, poweredBy: headers['x-powered-by'] || null };
}

// Checks the SSL/TLS certificate: issuer, expiry, validity
function checkCertificate(target, { timeoutMs = 8000 } = {}) {
  const url = normalizeUrl(target);
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: url.hostname, port: 443, servername: url.hostname, timeout: timeoutMs }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert || !cert.valid_to) return reject(new Error('No SSL certificate found.'));
      const validTo = new Date(cert.valid_to);
      const daysLeft = Math.ceil((validTo - Date.now()) / 86400000);
      resolve({
        subject: cert.subject?.CN, issuer: cert.issuer?.O || cert.issuer?.CN,
        validFrom: cert.valid_from, validTo: cert.valid_to, daysLeft,
        protocol: socket.getProtocol(), authorized: socket.authorized,
        authorizationError: socket.authorizationError || null,
      });
    });
    socket.on('timeout', () => { socket.destroy(); reject(new Error('TLS connection timed out.')); });
    socket.on('error', reject);
  });
}

module.exports = { normalizeUrl, fetchHeaders, checkSecurityHeaders, checkCertificate };
