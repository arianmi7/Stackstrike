#!/usr/bin/env node
'use strict';
const { main } = require('../src/index');

main(process.argv.slice(2)).catch((err) => {
  console.error('Unexpected error:', err?.message || err);
  process.exitCode = 1;
});
