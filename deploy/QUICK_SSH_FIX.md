# 🚀 QUICK START: Fix Your SSH Access in 3 Steps

## Your Public Key (you'll need this):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net
```

---

## 🎯 Option A: Quick Fix (via Hosting Provider Console)

### Step 1: Open Your Server Console
1. Go to your hosting provider's website (Vultr/DigitalOcean/AWS/etc.)
2. Find server `45.76.127.23`
3. Click **"Console"** or **"Access"** button

### Step 2: Log In & Run Command
In the console window, log in (probably as `root`) and paste this:

```bash
mkdir -p /home/paiz_valerie27/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> /home/paiz_valerie27/.ssh/authorized_keys && chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh && chmod 700 /home/paiz_valerie27/.ssh && chmod 600 /home/paiz_valerie27/.ssh/authorized_keys && echo "✅ Done! Try connecting now."
```

### Step 3: Test Connection (from your Windows machine)
Open your bash terminal and run:
```bash
ssh wtwr-server
```

That's it! 🎉

---

## 🎯 Option B: Manual Setup (if you prefer step-by-step)

### On Server (via console):
```bash
# 1. Create SSH directory
mkdir -p /home/paiz_valerie27/.ssh

# 2. Add your key (paste as ONE line)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> /home/paiz_valerie27/.ssh/authorized_keys

# 3. Fix permissions
chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh
chmod 700 /home/paiz_valerie27/.ssh
chmod 600 /home/paiz_valerie27/.ssh/authorized_keys

# 4. Verify
cat /home/paiz_valerie27/.ssh/authorized_keys
```

### On Your Windows Machine:
```bash
# Test connection
ssh wtwr-server

# Or use full command
ssh -i ~/.ssh/closet_wtwr_new paiz_valerie27@45.76.127.23
```

---

## 📺 What You'll See When It Works:

### Before (with error):
```
paiz_valerie27@45.76.127.23's password: 
Permission denied, please try again.
```

### After (success):
```
Welcome to Ubuntu 24.04 LTS
Last login: Thu Nov 21 12:30:45 2025
paiz_valerie27@server:~$ 
```

---

## 🔍 Troubleshooting

### "Still asking for password"
- Make sure you copied the ENTIRE public key (starts with `ssh-ed25519` and ends with the email)
- Check file permissions on server: `ls -la /home/paiz_valerie27/.ssh/`
  - Should show: `drwx------` for `.ssh/` and `-rw-------` for `authorized_keys`

### "Permission denied (publickey)"
- Verify the key was added: `cat /home/paiz_valerie27/.ssh/authorized_keys`
- Check SSH config: `sudo grep PubkeyAuthentication /etc/ssh/sshd_config`
  - Should say: `PubkeyAuthentication yes`
- Restart SSH: `sudo systemctl restart ssh`

### "Connection refused"
- Check if SSH is running: `sudo systemctl status ssh`
- Check firewall: `sudo ufw status`

---

## ✅ Success Checklist

- [ ] Opened hosting provider console
- [ ] Logged into server console
- [ ] Ran the one-line command (or manual steps)
- [ ] Tested connection with `ssh wtwr-server`
- [ ] Connected without password prompt!

---

## 🎉 After Success - Deploy Your Website

Once SSH works, you can deploy:

```bash
# Connect to server
ssh wtwr-server

# Run the fix script
sudo bash ~/COMPLETE_FIX_SCRIPT.sh

# Build and deploy frontend (from your local machine)
cd /d/TripTenProj/wtwr/se_project_react
npm run build

# Upload to server
scp -r dist/* wtwr-server:/tmp/frontend/
ssh wtwr-server "sudo cp -r /tmp/frontend/* /var/www/closet.wtwr/"

# Start backend
ssh wtwr-server "cd ~/se_project_express && pm2 start app.js --name wtwr-api && pm2 save"
```

Your website will then be live! 🚀
