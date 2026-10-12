'use strict';
const readline = require('node:readline');
const { printBanner } = require('./banner');
const fmt = require('./format');
const cmds = require('./commands');

const ITEMS = [
  { key: '1', label: 'My public IP', run: () => cmds.cmdMyIp() },
  { key: '2', label: 'IP / domain info', run: (ask) => ask('IP or domain: ').then(cmds.cmdIpLookup) },
  { key: '3', label: 'DNS records for a domain', run: (ask) => ask('Domain: ').then(cmds.cmdDns) },
  { key: '4', label: 'Website security headers check', run: (ask) => ask('Website URL: ').then(cmds.cmdHeaders) },
  { key: '5', label: 'SSL certificate check', run: (ask) => ask('Website URL: ').then(cmds.cmdSsl) },
  { key: '6', label: 'WHOIS domain lookup', run: (ask) => ask('Domain: ').then(cmds.cmdWhois) },
  { key: '7', label: 'Ping', run: (ask) => ask('Host: ').then(cmds.cmdPing) },
  { key: '8', label: 'Traceroute', run: (ask) => ask('Host: ').then(cmds.cmdTraceroute) },
  { key: '9', label: 'Common port check (authorized hosts only)', run: (ask) => ask('Host: ').then(cmds.cmdPorts) },
  { key: '10', label: 'robots.txt / sitemap.xml', run: (ask) => ask('Website URL: ').then(cmds.cmdRobots) },
  { key: '11', label: 'Full security audit (headers + SSL + robots)', run: (ask) => ask('Website URL: ').then(cmds.cmdFullAudit) },
  { key: '0', label: 'Exit', run: null },
];

function printMenu() {
  console.log(fmt.bold('Options:'));
  for (const item of ITEMS) console.log(`  ${fmt.cyan(item.key.padStart(2))}) ${item.label}`);
  console.log('');
}

async function startMenu() {
  printBanner();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((resolve) => rl.question(`  ${q}`, (a) => resolve(a.trim())));

  // eslint-disable-next-line no-constant-condition
  while (true) {
    printMenu();
    const choice = (await ask('Choose an option: ')).trim();
    const item = ITEMS.find((i) => i.key === choice);
    if (!item) { fmt.fail('Invalid option.'); continue; }
    if (item.key === '0') break;
    try { await item.run(ask); } catch (err) { fmt.fail(err.message || String(err)); }
    console.log('');
  }
  rl.close();
  console.log(fmt.dim('Goodbye!'));
}

module.exports = { startMenu };
