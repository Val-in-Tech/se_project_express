#!/bin/bash
# Complete deployment script - Run this AFTER SSH key is set up
# This will fix nginx, deploy frontend, and start backend

set -e

echo "=================================================="
echo "   WTWR Complete Deployment"
echo "=================================================="
echo ""

# Step 1: Build frontend locally
echo "Step 1: Building React frontend..."
cd se_project_react
npm run build
cd ..
echo "✅ Frontend built"
echo ""

# Step 2: Upload fix script to server
echo "Step 2: Uploading fix script to server..."
scp deploy/COMPLETE_FIX_SCRIPT.sh wtwr-server:~/
echo "✅ Script uploaded"
echo ""

# Step 3: Run nginx fix on server
echo "Step 3: Fixing nginx configuration..."
# Allocate a TTY so sudo can prompt for a password if required
ssh -t wtwr-server "sudo bash ~/COMPLETE_FIX_SCRIPT.sh"
echo "✅ Nginx fixed"
echo ""

# Step 4: Upload frontend build to server
echo "Step 4: Deploying frontend files..."
ssh wtwr-server "mkdir -p /tmp/frontend"
scp -r se_project_react/dist/* wtwr-server:/tmp/frontend/
ssh wtwr-server "sudo mkdir -p /var/www/closet.wtwr && sudo cp -r /tmp/frontend/* /var/www/closet.wtwr/ && sudo chown -R www-data:www-data /var/www/closet.wtwr"
echo "✅ Frontend deployed"
echo ""

# Step 5: Upload backend code
echo "Step 5: Uploading backend code..."
ssh wtwr-server "mkdir -p ~/se_project_express"
scp -r se_project_express/* wtwr-server:~/se_project_express/
echo "✅ Backend uploaded"
echo ""

# Step 6: Install dependencies and start backend
echo "Step 6: Starting backend service..."
ssh wtwr-server << 'ENDSSH'
cd ~/se_project_express
npm install --production
pm2 delete wtwr-api 2>/dev/null || true
pm2 start app.js --name wtwr-api
pm2 save
pm2 startup
ENDSSH
echo "✅ Backend started"
echo ""

# Step 7: Test deployment
echo "Step 7: Testing deployment..."
echo ""
echo "Frontend test:"
curl -I https://closet.wtwr.verymad.net 2>&1 | head -5
echo ""
echo "Backend test:"
curl -I https://api.closet.wtwr.verymad.net/items 2>&1 | head -5
echo ""

echo "=================================================="
echo "   Deployment Complete! 🎉"
echo "=================================================="
echo ""
echo "Your website should now be live:"
echo "  Frontend: https://closet.wtwr.verymad.net"
echo "  Backend:  https://api.closet.wtwr.verymad.net"
echo ""
echo "Check logs on server:"
echo "  ssh wtwr-server"
echo "  pm2 logs wtwr-api"
echo ""
