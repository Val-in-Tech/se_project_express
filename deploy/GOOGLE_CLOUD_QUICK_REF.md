# ⚡ GOOGLE CLOUD - QUICK COMMAND REFERENCE

## 🔑 Your Server Details
```
IP Address:   136.112.133.75
Domain:       closet.wtwr.verymad.net
Username:     paiz_valerie27
SSH Key:      ~/.ssh/closet_wtwr_new
```

## 🚀 ONE COMMAND TO FIX SSH

### Step 1: Open Google Cloud Browser SSH
Go to: https://console.cloud.google.com/compute/instances
Click your instance → Click "SSH" button

### Step 2: Paste This (all one line):
```bash
sudo mkdir -p /home/paiz_valerie27/.ssh && sudo bash -c 'echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> /home/paiz_valerie27/.ssh/authorized_keys' && sudo chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh && sudo chmod 700 /home/paiz_valerie27/.ssh && sudo chmod 600 /home/paiz_valerie27/.ssh/authorized_keys && echo "✅ Done!"
```

### Step 3: Test From Your Windows Machine
```bash
ssh wtwr-server
```

## 🎯 Alternative: Add via Google Cloud Web UI

1. Go to: https://console.cloud.google.com/compute/metadata
2. Click **SSH Keys** tab
3. Click **Edit** → **Add Item**
4. Paste: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj`
5. Click **Save**

## 🚀 After SSH Works - Deploy Everything

```bash
cd /d/TripTenProj/wtwr
bash deploy/deploy_everything.sh
```

## 📞 Common Commands

```bash
# Connect to server
ssh wtwr-server

# Check if user exists
ssh wtwr-server "id paiz_valerie27"

# Check SSH key
ssh wtwr-server "cat ~/.ssh/authorized_keys"

# Check backend status
ssh wtwr-server "pm2 status"

# View logs
ssh wtwr-server "pm2 logs wtwr-api"

# Restart backend
ssh wtwr-server "pm2 restart wtwr-api"
```

## 🔥 Google Cloud Specific

### Check Firewall Rules
```bash
# In Google Cloud SSH console:
sudo ufw status
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Or via Web Console:
VPC Network → Firewall → Make sure these exist:
- default-allow-ssh (tcp:22)
- default-allow-http (tcp:80)
- default-allow-https (tcp:443)

## 🎯 Quick Links

- **Google Cloud Console:** https://console.cloud.google.com/
- **VM Instances:** https://console.cloud.google.com/compute/instances
- **Firewall Rules:** https://console.cloud.google.com/networking/firewalls/list
- **FreeDNS (update DNS):** https://freedns.afraid.org/

## ✅ Success = This Works:
```bash
ssh wtwr-server
# Should connect without asking for password!
```
