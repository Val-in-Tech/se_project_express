#!/bin/bash
# Run this script as root via your hosting provider's web console
# It will fix nginx, set your password, and prepare for frontend deployment

set -e

echo "=== Step 1: Set user password ==="
echo "Setting password for paiz_valerie27..."
echo "paiz_valerie27:YourNewPassword123!" | chpasswd
echo "✓ Password set. Change 'YourNewPassword123!' above before running!"

echo ""
echo "=== Step 2: Add user to sudo group ==="
usermod -aG sudo paiz_valerie27
echo "✓ User added to sudo group"

echo ""
echo "=== Step 3: Backup broken nginx config ==="
cp /etc/nginx/sites-available/closet /etc/nginx/sites-available/closet.broken.bak
echo "✓ Backup created"

echo ""
echo "=== Step 4: Deploy working nginx config ==="
cat > /etc/nginx/sites-available/closet << 'EOF'
server {
    listen 80;
    server_name closet.wtwr.verymad.net www.closet.wtwr.verymad.net;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name closet.wtwr.verymad.net www.closet.wtwr.verymad.net;

    include /etc/nginx/snippets/snakeoil.conf;

    add_header 'Access-Control-Allow-Origin' 'https://closet.wtwr.verymad.net' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept' always;
    add_header 'Vary' 'Origin' always;

    if ($request_method = 'OPTIONS') {
        return 204;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /items {
        proxy_pass http://127.0.0.1:3001/items;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /signin {
        proxy_pass http://127.0.0.1:3001/signin;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /signup {
        proxy_pass http://127.0.0.1:3001/signup;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /users {
        proxy_pass http://127.0.0.1:3001/users;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    root /var/www/closet.wtwr;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    access_log /var/log/nginx/closet.access.log;
    error_log /var/log/nginx/closet.error.log;
}
EOF

echo "✓ Nginx config deployed"

echo ""
echo "=== Step 5: Create webroot directory ==="
mkdir -p /var/www/closet.wtwr
chown -R www-data:www-data /var/www/closet.wtwr
chmod -R 755 /var/www/closet.wtwr
echo "✓ Webroot created"

echo ""
echo "=== Step 6: Test and start nginx ==="
nginx -t
systemctl start nginx 2>/dev/null || systemctl reload nginx
systemctl enable nginx
echo "✓ Nginx running"

echo ""
echo "=== Step 7: Verify PM2 backend is running ==="
su - paiz_valerie27 -c "pm2 status"
echo "✓ Backend status shown above"

echo ""
echo "=========================================="
echo "✓ Server setup complete!"
echo ""
echo "Next steps (run from your Windows machine):"
echo "1. Build frontend:"
echo "   cd d:/TripTenProj/wtwr/se_project_react"
echo "   npm.cmd run build"
echo ""
echo "2. Upload to VM:"
echo "   scp -r dist/* paiz_valerie27@136.112.133.75:/tmp/closet_build/"
echo ""
echo "3. Deploy (SSH to VM with your new password):"
echo "   sudo rsync -av --delete /tmp/closet_build/ /var/www/closet.wtwr/"
echo "   sudo chown -R www-data:www-data /var/www/closet.wtwr"
echo ""
echo "4. Test:"
echo "   curl https://closet.wtwr.verymad.net/"
echo "=========================================="
