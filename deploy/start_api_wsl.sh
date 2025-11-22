#!/usr/bin/env bash
# deploy/start_api_wsl.sh
# Safe helper to install Node, pm2, and run the Express API under WSL.
# Usage: sudo bash deploy/start_api_wsl.sh
set -euo pipefail

echo "== Ensure apt lists are up to date =="
sudo apt-get update

# Install Node 18 LTS if not present
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js 18.x..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs build-essential
else
  echo "Node present: $(node -v)"
fi

# Install pm2 globally
if ! command -v pm2 >/dev/null 2>&1; then
  echo "Installing pm2 globally..."
  sudo npm install -g pm2
else
  echo "pm2 present: $(pm2 -v)"
fi

APP_DIR="/mnt/d/TripTenProj/wtwr/se_project_express"
if [ ! -d "$APP_DIR" ]; then
  echo "App directory not found: $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

# Install dependencies (use npm ci in CI; use install when developing)
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

# Start app with pm2 using the ecosystem file if present
if [ -f ecosystem.config.js ]; then
  pm2 start ecosystem.config.js --env production || pm2 restart ecosystem.config.js --env production
  pm2 save
  echo "Started via pm2. Run 'pm2 ls' to check. Logs: pm2 logs wtwr-api"
else
  # Fallback: start node directly under pm2 for easier management
  pm2 start app.js --name wtwr-api --cwd "$APP_DIR" --interpreter node
  pm2 save
  echo "Started app.js via pm2 as 'wtwr-api'."
fi

echo "Done. Use 'pm2 logs wtwr-api' to view output."
