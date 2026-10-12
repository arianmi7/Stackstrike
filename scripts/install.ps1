# Arianstack installer for Windows (PowerShell)
# Usage: irm https://raw.githubusercontent.com/<USER>/arianstack/main/scripts/install.ps1 | iex
$ErrorActionPreference = "Stop"
$Repo = if ($env:ARIANSTACK_REPO) { $env:ARIANSTACK_REPO } else { "REPLACE_WITH_YOUR_GITHUB/arianstack" }

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js not found. Install Node.js 18+ from https://nodejs.org first."
    exit 1
}

Write-Host "Installing Arianstack from github:$Repo ..."
npm install -g "github:$Repo"
Write-Host "Done. Run it with: arianstack"
