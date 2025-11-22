# SSH Key Setup Guide for Server Access

## 🔑 Your Situation
- You have SSH keys already generated ✅
- You need to add your public key to the server
- You can't log in because the password doesn't work

## 📋 Your SSH Public Key

Copy this ENTIRE line (this is what you'll add to the server):

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net
```

## 🚀 Step-by-Step Setup

### Method 1: Using Hosting Provider Console (Recommended)

Since you can't SSH with password, you need to use your hosting provider's web console:

#### Step 1: Access Server Console
1. Log into your hosting provider's dashboard (Vultr, DigitalOcean, AWS, etc.)
2. Find your server: `45.76.127.23`
3. Click "Console" or "VNC" or "Serial Console" to access the server directly

#### Step 2: Log In as Root (via Console)
```bash
# You should be able to log in as root in the console
# If prompted for username, type: root
# Then enter the root password (you should have this from your provider)
```

#### Step 3: Add Your SSH Key
Run these commands in the server console:

```bash
# Switch to the paiz_valerie27 user
su - paiz_valerie27

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key (paste the entire key as one line)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys

# Verify it was added
cat ~/.ssh/authorized_keys

# Exit back to root
exit
```

#### Step 4: Test SSH Connection (from your local machine)
```bash
# Try connecting with your SSH key
ssh -i ~/.ssh/closet_wtwr_new paiz_valerie27@45.76.127.23

# If that works, you're done! 🎉
```

---

### Method 2: Using Root Access (if you have it)

If you can log in as root:

```bash
# SSH as root
ssh root@45.76.127.23

# Then run the following commands:
mkdir -p /home/paiz_valerie27/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> /home/paiz_valerie27/.ssh/authorized_keys
chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh
chmod 700 /home/paiz_valerie27/.ssh
chmod 600 /home/paiz_valerie27/.ssh/authorized_keys

# Test the connection
exit
ssh -i ~/.ssh/closet_wtwr_new paiz_valerie27@45.76.127.23
```

---

### Method 3: One-Line Server Setup (Run in Provider Console)

If you have console access, run this single command as root:

```bash
mkdir -p /home/paiz_valerie27/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net" >> /home/paiz_valerie27/.ssh/authorized_keys && chown -R paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh && chmod 700 /home/paiz_valerie27/.ssh && chmod 600 /home/paiz_valerie27/.ssh/authorized_keys && echo "✅ SSH key added successfully!"
```

---

## 🔧 After Setup - Configure SSH for Easy Access

Once SSH key is working, create an SSH config file on your local machine:

```bash
# This will make connecting easier
cat >> ~/.ssh/config << 'EOF'

Host wtwr-server
    HostName 45.76.127.23
    User paiz_valerie27
    IdentityFile ~/.ssh/closet_wtwr_new
    StrictHostKeyChecking no

EOF
```

Then you can connect with just:
```bash
ssh wtwr-server
```

---

## 📝 Troubleshooting

### If connection still fails after adding key:

1. **Check SSH service on server** (via console):
```bash
systemctl status ssh
systemctl restart ssh
```

2. **Check SSH daemon config** (via console):
```bash
grep -E "PubkeyAuthentication|PasswordAuthentication" /etc/ssh/sshd_config
# Should show: PubkeyAuthentication yes
```

3. **Check file permissions** (via console):
```bash
ls -la /home/paiz_valerie27/.ssh/
# Should show:
# drwx------ (700) for .ssh/
# -rw------- (600) for authorized_keys
```

4. **Check SSH logs on server** (via console):
```bash
tail -f /var/log/auth.log
# Then try connecting from your machine and watch for errors
```

---

## ✅ Verification

After setup, test with verbose output to see what's happening:

```bash
ssh -v -i ~/.ssh/closet_wtwr_new paiz_valerie27@45.76.127.23
```

If you see "Offering public key" and "Server accepts key", you're authenticated! 🎉

---

## 🎯 Quick Reference

**Your public key location:** `~/.ssh/closet_wtwr_new.pub`
**Your private key location:** `~/.ssh/closet_wtwr_new`
**Server IP:** `45.76.127.23`
**Username:** `paiz_valerie27`

**Connect command:**
```bash
ssh -i ~/.ssh/closet_wtwr_new paiz_valerie27@45.76.127.23
```

**Or after SSH config setup:**
```bash
ssh wtwr-server
```
