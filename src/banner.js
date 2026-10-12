'use strict';
const BLUE = '\x1b[94m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function colorsSupported() {
  if (process.env.NO_COLOR) return false;
  if (process.platform === 'win32') {
    return Boolean(process.env.WT_SESSION || process.env.TERM_PROGRAM || process.env.ANSICON || process.env.ConEmuANSI === 'ON');
  }
  return process.stdout.isTTY === true;
}

const ART = [
  '    _       _                 _             _    ',
  '   / \\   _ __(_) __ _ _ __    / ___|| |_ __ _  ___| | __',
  '  / _ \\ | \'__| |/ _` | \'_ \\   \\___ \\| __/ _` |/ __| |/ /',
  ' / ___ \\| |  | | (_| | | | |   ___) | || (_| | (__|   < ',
  '/_/   \\_\\_|  |_|\\__,_|_| |_|  |____/ \\__\\__,_|\\___|_|\\_\\',
];

function printBanner() {
  const useColor = colorsSupported();
  console.log('');
  for (const row of ART) console.log(useColor ? `${BLUE}${BOLD}${row}${RESET}` : row);
  console.log(useColor ? `${BLUE}${BOLD}ARIANSTACK${RESET}  - command-line network & security toolkit` : 'ARIANSTACK - command-line network & security toolkit');
  console.log('');
}

module.exports = { printBanner, colorsSupported };
