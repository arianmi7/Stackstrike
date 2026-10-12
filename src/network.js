'use strict';
const { spawn } = require('node:child_process');
const net = require('node:net');

function runCommand(cmd, args, { timeoutMs = 15000 } = {}) {
  return new Promise((resolve) => {
    let out = '';
    let child;
    try { child = spawn(cmd, args, { windowsHide: true }); }
    catch (err) { return resolve({ code: -1, output: '', error: err.message }); }
    const timer = setTimeout(() => { child.kill(); }, timeoutMs);
    child.stdout.on('data', (d) => (out += d.toString()));
    child.stderr.on('data', (d) => (out += d.toString()));
    child.on('error', (err) => { clearTimeout(timer); resolve({ code: -1, output: out, error: err.message }); });
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, output: out.trim(), error: null }); });
  });
}

async function ping(host) {
  const isWin = process.platform === 'win32';
  const args = isWin ? ['-n', '4', host] : ['-c', '4', host];
  const { output, error, code } = await runCommand('ping', args);
  if (error) throw new Error('The "ping" command is not available on this system.');
  return { output, success: code === 0 };
}

async function traceroute(host) {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'tracert' : 'traceroute';
  const args = isWin ? ['-h', '15', host] : ['-m', '15', host];
  const { output, error } = await runCommand(cmd, args, { timeoutMs: 30000 });
  if (error) throw new Error(`The "${cmd}" command is not available on this system.`);
  return output;
}

const COMMON_PORTS = [
  [21, 'FTP'], [22, 'SSH'], [23, 'Telnet'], [25, 'SMTP'], [53, 'DNS'],
  [80, 'HTTP'], [110, 'POP3'], [143, 'IMAP'], [443, 'HTTPS'], [3306, 'MySQL'],
  [3389, 'RDP'], [5432, 'PostgreSQL'], [6379, 'Redis'], [8080, 'HTTP-Alt'], [27017, 'MongoDB'],
];

function checkPort(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (open) => { if (!done) { done = true; socket.destroy(); resolve(open); } };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

async function scanCommonPorts(host) {
  const results = [];
  for (const [port, name] of COMMON_PORTS) {
    results.push({ port, name, open: await checkPort(host, port) });
  }
  return results;
}

module.exports = { ping, traceroute, scanCommonPorts, COMMON_PORTS };
