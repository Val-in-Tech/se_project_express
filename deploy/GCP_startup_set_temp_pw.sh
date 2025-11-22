#!/bin/bash
# Startup script to run as root on boot (Google Cloud startup-script metadata)
# Purpose: set a temporary password for paiz_valerie27 and optionally run COMPLETE_FIX_SCRIPT.sh
# IMPORTANT: After use, remove the startup-script metadata from the instance to avoid leaving credentials in metadata.

# --- CONFIGURE THIS PASSWORD BEFORE PASTING ---
# Generated temporary password (change after first login)
TEMP_PASSWORD='Gcp!7rV#2zQp9Lm$'
echo "paiz_valerie27:${TEMP_PASSWORD}" | chpasswd 2>&1 | tee /var/log/startup_chpasswd.log || true

# Ensure .ssh exists and has correct permissions
mkdir -p /home/paiz_valerie27/.ssh
chown paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh
chmod 700 /home/paiz_valerie27/.ssh

# Ensure authorized_keys contains your public key (idempotent)
PUBKEY='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK72jLYXqJwyDVpYgJ7jDf48WKzt32cJxaCi8zL7NFYj valintech00@api.closet.wtwr.verymad.net'
grep -qxF "$PUBKEY" /home/paiz_valerie27/.ssh/authorized_keys 2>/dev/null || echo "$PUBKEY" >> /home/paiz_valerie27/.ssh/authorized_keys
chown paiz_valerie27:paiz_valerie27 /home/paiz_valerie27/.ssh/authorized_keys
chmod 600 /home/paiz_valerie27/.ssh/authorized_keys

# Optionally run COMPLETE_FIX_SCRIPT.sh if present and executable
if [ -x /home/paiz_valerie27/COMPLETE_FIX_SCRIPT.sh ]; then
  # Run the fix script as root and capture output for debugging
  sudo /bin/bash /home/paiz_valerie27/COMPLETE_FIX_SCRIPT.sh 2>&1 | tee /var/log/complete_fix_script.log || true
fi

# Log marker so you can see this ran in serial console / syslog
logger "startup-script: set temporary password for paiz_valerie27 and ensured authorized_keys"

echo "startup-script run complete"
echo "TEMP_PASSWORD=${TEMP_PASSWORD}" > /var/log/startup_temp_pw
chmod 600 /var/log/startup_temp_pw
