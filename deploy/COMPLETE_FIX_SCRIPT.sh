#!/bin/bash
# Complete fix script to deploy both frontend and backend configurations
# Run this on your server as root or with sudo

set -e

echo "=================================================="
echo "   Fixing WTWR Website - Frontend & Backend"
echo "=================================================="

# Step 1: Backup existing configs
echo ""
echo "Step 1: Backing up existing nginx configs..."
mkdir -p /etc/nginx/sites-available/backup
cp /etc/nginx/sites-available/closet /etc/nginx/sites-available/backup/closet.$(date +%Y%m%d_%H%M%S).bak 2>/dev/null || true
cp /etc/nginx/sites-available/api /etc/nginx/sites-available/backup/api.$(date +%Y%m%d_%H%M%S).bak 2>/dev/null || true
echo "✓ Backups created"

# Step 2: Deploy frontend config
echo ""
echo "Step 2: Deploying frontend configuration..."
cat > /etc/nginx/sites-available/closet << 'EOF'
# Frontend configuration for closet.wtwr.verymad.net
server {
    listen 80;
    server_name closet.wtwr.verymad.net www.closet.wtwr.verymad.net;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name closet.wtwr.verymad.net www.closet.wtwr.verymad.net;

    ssl_certificate /etc/letsencrypt/live/closet.wtwr.verymad.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/closet.wtwr.verymad.net/privkey.pem;

    root /var/www/closet.wtwr;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    access_log /var/log/nginx/closet_frontend.access.log;
    error_log /var/log/nginx/closet_frontend.error.log;
}
EOF
echo "✓ Frontend config deployed"

# Step 3: Deploy backend API config
echo ""
echo "Step 3: Deploying backend API configuration..."
cat > /etc/nginx/sites-available/api << 'EOF'
# Backend API configuration for api.closet.wtwr.verymad.net
server {
    listen 80;
    server_name api.closet.wtwr.verymad.net;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.closet.wtwr.verymad.net;

    ssl_certificate /etc/letsencrypt/live/closet.wtwr.verymad.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/closet.wtwr.verymad.net/privkey.pem;

    add_header 'Access-Control-Allow-Origin' 'https://closet.wtwr.verymad.net' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept' always;
    add_header 'Vary' 'Origin' always;

    if ($request_method = 'OPTIONS') {
        return 204;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    access_log /var/log/nginx/api_backend.access.log;
    error_log /var/log/nginx/api_backend.error.log;
}
EOF
echo "✓ Backend API config deployed"

# Step 4: Enable sites
echo ""
echo "Step 4: Enabling sites..."
ln -sf /etc/nginx/sites-available/closet /etc/nginx/sites-enabled/closet
ln -sf /etc/nginx/sites-available/api /etc/nginx/sites-enabled/api
echo "✓ Sites enabled"

# Step 5: Test nginx config
echo ""
echo "Step 5: Testing nginx configuration..."
nginx -t
echo "✓ Nginx config test passed"

# Step 6: Reload nginx
echo ""
echo "Step 6: Reloading nginx..."
systemctl reload nginx
echo "✓ Nginx reloaded"

# Step 7: Check if frontend files exist
echo ""
echo "Step 7: Checking frontend files..."
if [ ! -d "/var/www/closet.wtwr" ]; then
    echo "⚠ WARNING: Frontend directory /var/www/closet.wtwr does not exist!"
    echo "You need to build and deploy your React app to this directory."
elif [ ! -f "/var/www/closet.wtwr/index.html" ]; then
    echo "⚠ WARNING: /var/www/closet.wtwr/index.html not found!"
    echo "You need to build and deploy your React app to this directory."
else
    echo "✓ Frontend files found"
fi

# Step 8: Check if backend is running
echo ""
echo "Step 8: Checking backend service..."
if systemctl is-active --quiet wtwr-api 2>/dev/null; then
    echo "✓ Backend service is running"
elif pgrep -f "node.*app.js" > /dev/null; then
    echo "✓ Backend is running (via process)"
else
    echo "⚠ WARNING: Backend doesn't appear to be running!"
    echo "Start it with: pm2 start app.js --name wtwr-api"
    echo "Or: systemctl start wtwr-api"
fi

echo ""
echo "=================================================="
echo "   Fix Complete!"
echo "=================================================="
echo ""
echo "What was fixed:"
echo "  • Frontend (closet.wtwr.verymad.net) now serves React app"
echo "  • Backend API (api.closet.wtwr.verymad.net) proxies to Express"
echo "  • Proper CORS headers configured"
echo "  • Both HTTP→HTTPS redirects enabled"
echo ""
echo "Next steps:"
echo "  1. Build frontend: cd ~/se_project_react && npm run build"
echo "  2. Deploy frontend: sudo cp -r dist/* /var/www/closet.wtwr/"
echo "  3. Start backend: pm2 start ~/se_project_express/app.js --name wtwr-api"
echo "  4. Test: https://closet.wtwr.verymad.net"
echo ""
