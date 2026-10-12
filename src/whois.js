'use strict';
const net = require('node:net');

const SERVERS = {
  com: 'whois.verisign-grs.com', net: 'whois.verisign-grs.com', org: 'whois.pir.org',
  io: 'whois.nic.io', ir: 'whois.nic.ir', info: 'whois.afilias.net', co: 'whois.nic.co',
  dev: 'whois.nic.google', app: 'whois.nic.google', xyz: 'whois.nic.xyz',
};

function queryWhois(server, domain, { timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: server, port: 43 }, () => socket.write(`${domain}\r\n`));
    let data = '';
    socket.setTimeout(timeoutMs);
    socket.on('data', (c) => (data += c.toString('utf8')));
    socket.on('end', () => resolve(data));
    socket.on('timeout', () => { socket.destroy(); reject(new Error('WHOIS request timed out.')); });
    socket.on('error', reject);
  });
}

async function whois(domain) {
  const tld = domain.split('.').pop().toLowerCase();
  const server = SERVERS[tld] || 'whois.iana.org';
  const raw = await queryWhois(server, domain);
  if (!raw.trim()) throw new Error('No response from the WHOIS server.');
  return raw;
}

module.exports = { whois };
