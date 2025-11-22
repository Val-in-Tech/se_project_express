# Complete Deployment Instructions

## Step 1: Run Setup Script as Root (Via Provider Console)

1. **Log into your hosting provider's web dashboard**
2. **Find and open the root console** (Console, VNC, Serial Console, etc.)
3. **Copy and paste this entire block:**

```bash
cat > /tmp/fix_and_deploy.sh << 'SCRIPT_EOF'
#!/bin/bash
set -e

echo "=== Setting user password ==="
echo "paiz_valerie27:YourNewPassword123!" | chpasswd
echo "✓ Password set"

echo "=== Adding user to sudo ==="
usermod -aG sudo paiz_valerie27
echo "✓ Sudo access granted"

echo "=== Backing up nginx config ==="
cp /etc/nginx/sites-available/closet /etc/nginx/sites-available/closet.broken.bak 2>/dev/null || true
echo "✓ Backup done"

echo "=== Deploying nginx config ==="
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

echo "✓ Config deployed"

echo "=== Creating webroot ==="
mkdir -p /var/www/closet.wtwr
chown -R www-data:www-data /var/www/closet.wtwr
chmod -R 755 /var/www/closet.wtwr
echo "✓ Webroot ready"

echo "=== Testing and starting nginx ==="
nginx -t
systemctl start nginx 2>/dev/null || systemctl reload nginx
systemctl enable nginx
echo "✓ Nginx running"

echo ""
echo "✓✓✓ SETUP COMPLETE! ✓✓✓"
echo "Your password is: YourNewPassword123!"
echo "Change it immediately after login!"
SCRIPT_EOF

chmod +x /tmp/fix_and_deploy.sh
/tmp/fix_and_deploy.sh
```

4. **IMPORTANT:** Change `YourNewPassword123!` to your desired password before running

## Step 2: Build Frontend (Windows)

Open PowerShell or Git Bash:

```powershell
cd d:\TripTenProj\wtwr\se_project_react
npm.cmd run build
```

Or in Git Bash:
```bash
cd /d/TripTenProj/wtwr/se_project_react
npm run build
```

## Step 3: Upload Frontend to VM

```bash
scp -r dist/* paiz_valerie27@136.112.133.75:/tmp/closet_build/
```

Use password: `YourNewPassword123!` (or whatever you set)

## Step 4: Deploy Frontend (SSH to VM)

```bash
ssh paiz_valerie27@136.112.133.75
```

Then run:
```bash
sudo rsync -av --delete /tmp/closet_build/ /var/www/closet.wtwr/
sudo chown -R www-data:www-data /var/www/closet.wtwr
```

## Step 5: Verify Everything Works

```bash
# Check frontend
curl -I https://closet.wtwr.verymad.net/

# Check backend
curl https://closet.wtwr.verymad.net/items

# Check CORS
curl -I -X OPTIONS 'https://closet.wtwr.verymad.net/items' \
  -H 'Origin: https://closet.wtwr.verymad.net' \
  -H 'Access-Control-Request-Method: GET'
```

## Step 6: Test in Browser

Open: https://closet.wtwr.verymad.net/

You should see your React app!

## Troubleshooting

**If nginx won't start:**
```bash
sudo nginx -t
sudo journalctl -u nginx -n 50
```

**If backend isn't running:**
```bash
pm2 status
pm2 restart wtwr-api
pm2 logs wtwr-api
```

**If you see 502 Bad Gateway:**
Backend isn't running. Check PM2.

**If you see 404:**
Frontend files not deployed to `/var/www/closet.wtwr/`
