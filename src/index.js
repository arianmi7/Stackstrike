'use strict';
const { printBanner } = require('./banner');
const { startMenu } = require('./menu');
const cmds = require('./commands');
const fmt = require('./format');

const VERSION = require('../package.json').version;

const HELP = `
Commands:
  arianstack                     interactive menu
  arianstack myip                your public IP
  arianstack ip <target>         IP or domain info
  arianstack dns <domain>        DNS records
  arianstack headers <url>       website security headers check
  arianstack ssl <url>           SSL certificate check
  arianstack whois <domain>      WHOIS domain lookup
  arianstack ping <host>         ping
  arianstack trace <host>        traceroute
  arianstack ports <host>        common port check (authorized hosts only)
  arianstack robots <url>        robots.txt / sitemap.xml
  arianstack audit <url>         full security audit
  arianstack --version           show version
  arianstack --help              show this help
`;

const ROUTES = {
  myip: () => cmds.cmdMyIp(),
  ip: (a) => cmds.cmdIpLookup(a[0]),
  dns: (a) => cmds.cmdDns(a[0]),
  headers: (a) => cmds.cmdHeaders(a[0]),
  ssl: (a) => cmds.cmdSsl(a[0]),
  whois: (a) => cmds.cmdWhois(a[0]),
  ping: (a) => cmds.cmdPing(a[0]),
  trace: (a) => cmds.cmdTraceroute(a[0]),
  traceroute: (a) => cmds.cmdTraceroute(a[0]),
  ports: (a) => cmds.cmdPorts(a[0]),
  robots: (a) => cmds.cmdRobots(a[0]),
  audit: (a) => cmds.cmdFullAudit(a[0]),
};

async function main(argv) {
  const [cmd, ...rest] = argv;

  if (!cmd) return startMenu();
  if (cmd === '--version' || cmd === '-v') { console.log(VERSION); return; }
  if (cmd === '--help' || cmd === '-h' || cmd === 'help') { printBanner(); console.log(HELP); return; }

  const handler = ROUTES[cmd];
  if (!handler) {
    printBanner();
    fmt.fail(`Unknown command: ${cmd}`);
    console.log(HELP);
    process.exitCode = 1;
    return;
  }
  printBanner();
  await handler(rest);
}

module.exports = { main };
