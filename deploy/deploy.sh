
#!/usr/bin/env bash
set -euo pipefail

# Simple deploy script (local server). Adjust paths and commands for your environment.
# Usage: cd deploy && ./deploy.sh

# 1) Build frontend
echo "Building front-end (se_project_react)..."
pushd "$(dirname "$0")/../se_project_react" >/dev/null
npm ci
npm run build
popd >/dev/null


# 2) Copy build to frontend serving directory (change DEST to the server path you want)
DEST="/var/www/closet.wtwr"
echo "Copying built files to $DEST"
sudo mkdir -p "$DEST"
sudo rm -rf "$DEST"/*
sudo cp -r "$(dirname "$0")/../se_project_react/dist/"* "$DEST/"

# Ensure web server user owns the files (adjust user:group if your server uses a different one)
sudo chown -R www-data:www-data "$DEST" || true

# 3) Test nginx config and reload
echo "Testing nginx configuration"
sudo nginx -t
echo "Reloading nginx"
sudo systemctl reload nginx

echo "Deployment finished. If your Node backend runs separately, restart it as needed."

# Optional: restart backend systemd unit (uncomment and set correctly)
# sudo systemctl restart wtwr-backend
