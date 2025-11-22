#!/bin/bash
# Run this script ON THE SERVER via console access
# This adds your SSH public key for password-free login

set -e

echo "=================================================="
echo "   SSH Key Setup for paiz_valerie27"
echo "=================================================="
echo ""

# Your public key
PUBLIC_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net"

USER="paiz_valerie27"
HOME_DIR="/home/$USER"
SSH_DIR="$HOME_DIR/.ssh"
AUTH_KEYS="$SSH_DIR/authorized_keys"

echo "Setting up SSH key for user: $USER"
echo ""

# Create .ssh directory
echo "Step 1: Creating .ssh directory..."
mkdir -p "$SSH_DIR"
echo "✓ Directory created"

# Add public key
echo ""
echo "Step 2: Adding public key..."
if grep -q "$PUBLIC_KEY" "$AUTH_KEYS" 2>/dev/null; then
    echo "⚠ Key already exists in authorized_keys"
else
    echo "$PUBLIC_KEY" >> "$AUTH_KEYS"
    echo "✓ Public key added"
fi

# Set correct ownership
echo ""
echo "Step 3: Setting ownership..."
chown -R "$USER:$USER" "$SSH_DIR"
echo "✓ Ownership set to $USER"

# Set correct permissions
echo ""
echo "Step 4: Setting permissions..."
chmod 700 "$SSH_DIR"
chmod 600 "$AUTH_KEYS"
echo "✓ Permissions set correctly"

# Verify setup
echo ""
echo "Step 5: Verifying setup..."
echo "SSH directory permissions:"
ls -ld "$SSH_DIR"
echo ""
echo "Authorized keys permissions:"
ls -l "$AUTH_KEYS"
echo ""
echo "Number of keys in authorized_keys:"
grep -c "ssh-" "$AUTH_KEYS" || echo "0"

echo ""
echo "=================================================="
echo "   Setup Complete! ✅"
echo "=================================================="
echo ""
echo "Now try connecting from your local machine:"
echo "  ssh -i ~/.ssh/closet_wtwr_new paiz_valerie27@45.76.127.23"
echo ""
