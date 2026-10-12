'use strict';
const { colorsSupported } = require('./banner');
const C = colorsSupported();
const paint = (code, s) => (C ? `\x1b[${code}m${s}\x1b[0m` : s);
const green = (s) => paint('92', s);
const red = (s) => paint('91', s);
const yellow = (s) => paint('93', s);
const cyan = (s) => paint('96', s);
const bold = (s) => paint('1', s);
const dim = (s) => paint('2', s);

function title(s) { console.log(`\n${bold(cyan('>> ' + s))}`); console.log(dim('-'.repeat(Math.min(60, s.length + 4)))); }
function kv(k, v) { console.log(`  ${dim(k + ':')} ${v ?? dim('-')}`); }
function ok(s) { console.log(`  ${green('[OK]')} ${s}`); }
function fail(s) { console.log(`  ${red('[FAIL]')} ${s}`); }
function warn(s) { console.log(`  ${yellow('[WARN]')} ${s}`); }

module.exports = { green, red, yellow, cyan, bold, dim, title, kv, ok, fail, warn };
