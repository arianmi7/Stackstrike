#!/usr/bin/env bash
# Arianstack installer for Linux and macOS
# Usage: curl -fsSL https://raw.githubusercontent.com/<USER>/arianstack/main/scripts/install.sh | bash
set -euo pipefail

REPO="${ARIANSTACK_REPO:-REPLACE_WITH_YOUR_GITHUB/arianstack}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install Node.js 18+ from https://nodejs.org first." >&2
  exit 1
fi

echo "Installing Arianstack from github:${REPO} ..."
npm install -g "github:${REPO}"
echo "Done. Run it with: arianstack"
