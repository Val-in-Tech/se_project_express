# 🔑 SSH Setup for Google Cloud - Step by Step Guide

## Your Server Info
- **Current IP:** 136.112.133.75
- **Domain:** closet.wtwr.verymad.net (via FreeDNS)
- **Hosting Provider:** Google Cloud Platform (GCP)
- **Username:** paiz_valerie27

---

## 📋 STEP 1: Access Google Cloud Console

### Method A: Using Google Cloud Console (Web Browser)

1. **Go to Google Cloud Console**
   - Open: https://console.cloud.google.com/
   - Log in with your Google account

2. **Find Your VM Instance**
   - Click **"Compute Engine"** in the left menu (or search for it)
   - Click **"VM instances"**
   - Look for your instance (should show IP: 136.112.133.75)
   - Click on the instance name

3. **Open SSH in Browser**
   - Click the **"SSH"** dropdown button (top of the page)
   - Select **"Open in browser window"**
   - A terminal will open in your browser (might take a few seconds)

4. **You're Now Connected!**
   - You should be logged in (probably as your Google username or a default user)

---

## 📋 STEP 2: Add Your SSH Key

Once you're in the Google Cloud SSH terminal, run these commands:

### Option 1: If you're logged in as root or have sudo access:

```bash
# Add your SSH key to paiz_valerie27 user
sudo mkdir -p /home/paiz_valerie27/.ssh
sudo bash -c 'echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> /home/paiz_valerie27/.ssh/authorized_keys'
sudo chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh
sudo chmod 700 /home/paiz_valerie27/.ssh
sudo chmod 600 /home/paiz_valerie27/.ssh/authorized_keys
echo "✅ SSH key added!"
```

### Option 2: If you're logged in as paiz_valerie27:

```bash
# Add your SSH key to your own account
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
echo "✅ SSH key added!"
```

---

## 📋 STEP 3: Update Your Local SSH Config

On your Windows machine, update the SSH config to use the correct IP:

```bash
# Edit SSH config
cat >> ~/.ssh/config << 'EOF'

# WTWR Google Cloud Server
Host wtwr-server
    HostName 136.112.133.75
    User paiz_valerie27
    IdentityFile ~/.ssh/closet_wtwr_new
    StrictHostKeyChecking no
    ServerAliveInterval 60

EOF
```

---

## 📋 STEP 4: Test Connection from Your Computer

Open your **Git Bash** on Windows and run:

```bash
ssh wtwr-server
```

**OR** the full command:
```bash
ssh -i ~/.ssh/closet_wtwr_new paiz_valerie27@136.112.133.75
```

### Expected Result (Success):
```
Welcome to Ubuntu...
paiz_valerie27@instance-name:~$ 
```

If you see this, **you're in!** 🎉

---

## 🎯 Alternative: Add SSH Key via Google Cloud Web Interface

Google Cloud lets you add SSH keys through the web interface:

### Method 1: Project-wide SSH Keys

1. In Google Cloud Console, go to **"Compute Engine"** → **"Metadata"**
2. Click the **"SSH Keys"** tab
3. Click **"Edit"**
4. Click **"Add Item"**
5. Paste your entire public key:
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net
   ```
6. Click **"Save"**

### Method 2: Instance-specific SSH Keys

1. Go to **"Compute Engine"** → **"VM instances"**
2. Click on your instance
3. Click **"Edit"** at the top
4. Scroll down to **"SSH Keys"**
5. Click **"Add Item"**
6. Paste your public key
7. Click **"Save"**

**Important:** When adding keys via Google Cloud Console, it will automatically extract the username from the key. If it doesn't match `paiz_valerie27`, you may need to format it like:
```
paiz_valerie27:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net
```

---

## 🔍 Visual Guide - Google Cloud Console Navigation

```
Google Cloud Console (console.cloud.google.com)
│
├─ Navigation Menu (≡)
│   └─ Compute Engine
│       ├─ VM instances
│       │   └─ Your Instance (136.112.133.75)
│       │       ├─ [SSH ▼] ← Click to open SSH
│       │       └─ Edit ← Add SSH keys here
│       │
│       └─ Metadata
│           └─ SSH Keys ← Add project-wide keys
│
└─ Your instance details
    ├─ SSH (button) ← Opens browser terminal
    ├─ Edit (button) ← Manage SSH keys
    └─ Connect (dropdown)
```

---

## 🐛 Troubleshooting

### Problem: Can't find my Google Cloud instance
**Solution:** 
- Check which Google account you used to create the server
- Go to: https://console.cloud.google.com/ and select the correct project
- Look in: Navigation Menu → Compute Engine → VM instances

### Problem: SSH button is grayed out
**Solution:**
- Instance might be stopped. Click "Start" to boot it up
- Wait for it to show green checkmark and "Running" status

### Problem: "Connection failed" in browser SSH
**Solution:**
- Check firewall rules: Compute Engine → Firewall → Make sure SSH (port 22) is allowed
- Try "Open in browser window on custom port"

### Problem: Still getting "Permission denied" after adding key
**Solution:** Run these in Google Cloud SSH console:
```bash
# Check if key was added correctly
sudo cat /home/paiz_valerie27/.ssh/authorized_keys

# Check permissions
sudo ls -la /home/paiz_valerie27/.ssh/

# Fix permissions if needed
sudo chmod 700 /home/paiz_valerie27/.ssh
sudo chmod 600 /home/paiz_valerie27/.ssh/authorized_keys
sudo chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh

# Check if user exists
id paiz_valerie27

# If user doesn't exist, create it
sudo useradd -m -s /bin/bash paiz_valerie27
```

### Problem: Wrong IP address (45.76.127.23 vs 136.112.133.75)
**Solution:**
- Your DNS is pointing to 136.112.133.75 (correct)
- Update FreeDNS if needed: https://freedns.afraid.org/
- Make sure to use 136.112.133.75 for direct SSH

---

## ✅ Quick Checklist

- [ ] Logged into Google Cloud Console (console.cloud.google.com)
- [ ] Found VM instance with IP `136.112.133.75`
- [ ] Opened SSH in browser window
- [ ] Added SSH key using one of the methods above
- [ ] Updated local SSH config to use correct IP
- [ ] Tested connection with `ssh wtwr-server`
- [ ] Connected without password! 🎉

---

## 🚀 Next Steps After SSH Works

1. **Upload the fix script:**
   ```bash
   scp deploy/COMPLETE_FIX_SCRIPT.sh wtwr-server:~/
   ```

2. **Run it on the server:**
   ```bash
   ssh wtwr-server "sudo bash ~/COMPLETE_FIX_SCRIPT.sh"
   ```

3. **Deploy your website:**
   ```bash
   bash deploy/deploy_everything.sh
   ```

---

## 💡 Pro Tips

- **Save your Google Cloud password** in a password manager
- **Enable 2FA** on your Google account for security
- **Create a snapshot** of your VM before making big changes (Compute Engine → Snapshots)
- **Use the SSH config** - just type `ssh wtwr-server` instead of the long command
- **Check firewall rules** if you have connection issues: Compute Engine → Firewall

---

## 🔥 Firewall Check (Important for Google Cloud!)

Google Cloud has strict firewall rules by default. Make sure these ports are open:

```bash
# Check from Google Cloud SSH console
sudo ufw status

# If firewall is active, allow SSH and web traffic
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3001/tcp  # Backend (if needed)
```

**Also check Google Cloud Firewall Rules:**
1. Go to **VPC Network** → **Firewall**
2. Make sure you have rules allowing:
   - SSH (tcp:22)
   - HTTP (tcp:80)
   - HTTPS (tcp:443)

---

Need help? The browser SSH is your friend! Access it at:
👉 https://console.cloud.google.com/ → Compute Engine → VM instances → Your instance → SSH
