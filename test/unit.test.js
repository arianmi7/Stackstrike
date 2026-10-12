'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeUrl } = require('../src/security');
const { colorsSupported } = require('../src/banner');

test('normalizeUrl adds https:// when missing', () => {
  assert.equal(normalizeUrl('yamelk.com').href, 'https://yamelk.com/');
  assert.equal(normalizeUrl('http://yamelk.com').protocol, 'http:');
});

test('colorsSupported returns a boolean and does not throw', () => {
  assert.equal(typeof colorsSupported(), 'boolean');
});

test('CLI: --help and --version exit cleanly', async () => {
  const { execFile } = require('node:child_process');
  const path = require('node:path');
  const bin = path.join(__dirname, '..', 'bin', 'arianstack.js');
  const run = (args) => new Promise((resolve) => {
    execFile(process.execPath, [bin, ...args], (err, stdout) => resolve({ code: err ? err.code : 0, stdout }));
  });
  const help = await run(['--help']);
  assert.equal(help.code, 0);
  assert.match(help.stdout, /ARIANSTACK/);
  const ver = await run(['--version']);
  assert.equal(ver.code, 0);
  assert.match(ver.stdout.trim(), /^\d+\.\d+\.\d+$/);
  const unknown = await run(['notacommand']);
  assert.equal(unknown.code, 1);
});

test('network.scanCommonPorts resolves without throwing (localhost)', async () => {
  const { scanCommonPorts } = require('../src/network');
  const results = await scanCommonPorts('127.0.0.1');
  assert.ok(Array.isArray(results) && results.length > 0);
  for (const r of results) assert.equal(typeof r.open, 'boolean');
});
