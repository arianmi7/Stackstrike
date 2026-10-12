# Arianstack

Cross-platform command-line network & security toolkit — works the same on Linux, macOS, Windows CMD and PowerShell.

```
    _       _                 _             _
   / \   _ __(_) __ _ _ __    / ___|| |_ __ _  ___| | __
  / _ \ | '__| |/ _` | '_ \   \___ \| __/ _` |/ __| |/ /
 / ___ \| |  | | (_| | | | |   ___) | || (_| | (__|   <
/_/   \_\_|  |_|\__,_|_| |_|  |____/ \__\__,_|\___|_|\_\
ARIANSTACK - command-line network & security toolkit
```

## Features

| Command | What it does |
|---|---|
| `arianstack myip` | Your public IP + country/city/ISP |
| `arianstack ip <target>` | Geo/network info for an IP or domain |
| `arianstack dns <domain>` | A, AAAA, MX, TXT, NS, CNAME records |
| `arianstack headers <url>` | HTTP security headers check (HSTS, CSP, ...) |
| `arianstack ssl <url>` | SSL certificate validity and expiry |
| `arianstack whois <domain>` | WHOIS domain info |
| `arianstack ping <host>` | Ping |
| `arianstack trace <host>` | Traceroute / tracert |
| `arianstack ports <host>` | Common port open/closed check |
| `arianstack robots <url>` | robots.txt and sitemap.xml check |
| `arianstack audit <url>` | Combined headers + SSL + robots report |
| `arianstack` (no args) | Interactive menu with all options above |

Run with no arguments to see the blue ARIANSTACK banner and a numbered menu.

### Scope and limitations

- The "security" checks are **non-intrusive only** (HTTP headers, SSL certificate, robots.txt) — not vulnerability scanning or exploitation. Real penetration testing requires written authorization from the site owner.
- `ports` only tests whether a TCP port accepts a connection. Only use it against systems you're authorized to test.
- This tool **cannot** find a person's live GPS location from a phone number — no legitimate public tool can do that. `ip` / `myip` only return the approximate location (usually city-level) associated with an IP address from public databases, not a person's location.

## Install

Requires **Node.js 18 or later** (from nodejs.org, or `winget install OpenJS.NodeJS.LTS` on Windows).

### Option 1: Install directly from GitHub (npm) — all operating systems

```bash
npm install -g github:<YOUR_GITHUB_USERNAME>/Stackstrike
```

Then, in any terminal (bash, zsh, CMD, PowerShell), just run:

```bash
arianstack
```

### Option 2: One-line install script

**Linux / macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/<YOUR_GITHUB_USERNAME>/Stackstrike/main/scripts/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/<YOUR_GITHUB_USERNAME>/Stackstrike/main/scripts/install.ps1 | iex
```

> Replace `<YOUR_GITHUB_USERNAME>` with your own GitHub username after you push this repo (in the two commands above, and inside `scripts/install.sh` and `scripts/install.ps1` themselves).

### Option 3: Run without installing

```bash
npx github:<YOUR_GITHUB_USERNAME>/Stackstrike myip
```

### Update / uninstall

```bash
npm install -g github:<YOUR_GITHUB_USERNAME>/Stackstrike   # update (same as install)
npm uninstall -g arianstack                                 # remove
```

## Local development

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/Stackstrike.git
cd arianstack
npm link        # makes the `arianstack` command available locally
npm test
```

## Project structure

```
arianstack/
├── bin/arianstack.js     # CLI entry point
├── src/
│   ├── index.js          # command routing
│   ├── menu.js           # interactive menu
│   ├── banner.js         # blue ARIANSTACK banner
│   ├── format.js         # output color/formatting helpers
│   ├── commands.js       # wires commands to the modules below
│   ├── ip.js             # public IP and IP lookup
│   ├── dns.js            # DNS records
│   ├── security.js       # security headers + SSL
│   ├── whois.js          # WHOIS
│   ├── network.js        # ping / traceroute / port check
│   └── crawlcheck.js     # robots.txt / sitemap.xml
├── scripts/install.sh    # Linux/macOS installer
├── scripts/install.ps1   # Windows installer
└── .github/workflows/ci.yml
```

## External services used

- `ipify.org` for the public IP
- `ipapi.co` for IP geolocation (free up to a request limit; get your own key from their site for heavier use)
- Official WHOIS servers per TLD

None of these require an API key except at high volume.

## License

MIT
