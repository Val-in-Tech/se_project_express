# 🎯 Complete SSH & Deployment Guide - START HERE

## 📍 Where You Are Now

You can't SSH into your server because you don't have the password, but you DO have SSH keys already generated. This guide will help you fix that.

**Your Setup:**
- **Hosting:** Google Cloud Platform
- **DNS:** FreeDNS (freedns.afraid.org)
- **Server IP:** 136.112.133.75
- **Domain:** closet.wtwr.verymad.net

---

## 🚀 Quick 3-Step Process

### ✅ STEP 1: Add Your SSH Key (5 minutes)
**Read:** `GOOGLE_CLOUD_SSH_SETUP.md` (detailed Google Cloud instructions)

**Quick version:**
1. Go to https://console.cloud.google.com/
2. Navigate to: Compute Engine → VM instances
3. Find your instance (136.112.133.75) → Click "SSH" button
4. In the browser terminal, paste this command:
```bash
sudo mkdir -p /home/paiz_valerie27/.ssh && sudo bash -c 'echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> /home/paiz_valerie27/.ssh/authorized_keys' && sudo chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh && sudo chmod 700 /home/paiz_valerie27/.ssh && sudo chmod 600 /home/paiz_valerie27/.ssh/authorized_keys
```
5. Test: `ssh wtwr-server` (from your Windows terminal)

---

### ✅ STEP 2: Fix Website Configuration (2 minutes)
Once SSH works, run from your Windows machine:

```bash
cd /d/TripTenProj/wtwr
bash deploy/deploy_everything.sh
```

This automatically:
- Builds your React frontend
- Fixes nginx configuration
- Deploys frontend to server
- Uploads backend code
- Starts the backend service

---

### ✅ STEP 3: Verify It Works
Open in browser:
- Frontend: https://closet.wtwr.verymad.net
- Backend: https://api.closet.wtwr.verymad.net/items

---

## 📚 All Documentation Files Created

| File | Purpose |
|------|---------|
| **GOOGLE_CLOUD_SSH_SETUP.md** | Step-by-step Google Cloud guide (START HERE) |
| **QUICK_SSH_FIX.md** | Quick reference for SSH setup |
| **SSH_SETUP_GUIDE.md** | Comprehensive SSH guide with troubleshooting |
| **FIX_EXPLANATION.md** | Why website wasn't working + fixes |
| **COMPLETE_FIX_SCRIPT.sh** | Nginx configuration fix (runs on server) |
| **deploy_everything.sh** | Full deployment automation (run locally) |
| **setup_ssh_key_on_server.sh** | SSH key setup script (runs on server) |
| **FIXED_closet_frontend.conf** | Nginx config for React app |
| **FIXED_api_backend.conf** | Nginx config for Express API |

---

## 🎬 Complete Command Sequence

After SSH key is added:

```bash
# Test SSH connection
ssh wtwr-server

# If that works, deploy everything:
cd /d/TripTenProj/wtwr
bash deploy/deploy_everything.sh

# Check backend logs
ssh wtwr-server "pm2 logs wtwr-api"

# Restart backend if needed
ssh wtwr-server "pm2 restart wtwr-api"
```

---

## 🔑 Your SSH Details

**Public Key (already configured locally):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj
```

**Connection Info:**
- Server: `136.112.133.75` (Google Cloud)
- Domain: `closet.wtwr.verymad.net`
- User: `paiz_valerie27`
- Key: `~/.ssh/closet_wtwr_new`
- Shortcut: `ssh wtwr-server` (already configured)

---

## 🐛 Troubleshooting Quick Reference

### SSH still asks for password
→ Check `GOOGLE_CLOUD_SSH_SETUP.md` section "Troubleshooting"

### Website shows 404
→ Frontend not deployed. Run `deploy_everything.sh`

### API returns 401
→ Backend not running. SSH in and run `pm2 start app.js --name wtwr-api`

### CORS errors
→ Nginx config issue. Run `COMPLETE_FIX_SCRIPT.sh` on server

---

## ✅ Success Checklist

- [ ] Opened Google Cloud Console
- [ ] Added SSH key via browser SSH terminal
- [ ] Tested: `ssh wtwr-server` works without password
- [ ] Ran: `bash deploy/deploy_everything.sh`
- [ ] Verified: Frontend shows at https://closet.wtwr.verymad.net
- [ ] Verified: API works at https://api.closet.wtwr.verymad.net/items
- [ ] Can log in and see clothing items

---

## 💡 What Was Wrong

1. **SSH Issue:** No SSH key on server = can't log in
2. **Nginx Issue:** All traffic routed to backend → frontend never served
3. **Code Issue:** Typo in API URL (`api.closet.wtwr.com.verymad.net` → fixed)

## 💡 What We Fixed

1. ✅ SSH key setup guide for Vultr console access
2. ✅ Separate nginx configs for frontend and backend
3. ✅ Fixed API URL typo in `auth.js`
4. ✅ Automated deployment script
5. ✅ SSH config for easy `ssh wtwr-server` access

---

## 🎯 Next Steps

1. **NOW:** Follow `GOOGLE_CLOUD_SSH_SETUP.md` to add your SSH key
2. **THEN:** Run `deploy_everything.sh` to deploy your site
3. **DONE:** Test your website!

---

## 📞 Quick Commands Reference

```bash
# Connect to server
ssh wtwr-server

# Deploy everything
bash deploy/deploy_everything.sh

# Check backend status
ssh wtwr-server "pm2 status"

# View backend logs
ssh wtwr-server "pm2 logs wtwr-api"

# Restart backend
ssh wtwr-server "pm2 restart wtwr-api"

# Check nginx status
ssh wtwr-server "sudo systemctl status nginx"

# Test frontend
curl https://closet.wtwr.verymad.net

# Test backend
curl https://api.closet.wtwr.verymad.net/items
```

---

**🚀 Ready to start? Open `GOOGLE_CLOUD_SSH_SETUP.md` and follow the steps!**
