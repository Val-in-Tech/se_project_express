Deployment notes

Prerequisites on the remote server
- Ensure `rsync`, `ssh`, and `nginx` are installed on the server.
- Make sure the deploy user (example: `Val-in-Tech`) exists and can SSH in.
- If the workflow will reload `nginx`, ensure the deploy user can run `sudo nginx -t` and `sudo systemctl reload nginx` (passwordless sudo or a separate step by an admin).

Adding the public key to the server
1. On your local machine generate an SSH key pair (if you don't already have one):

	```bash
	ssh-keygen -t ed25519 -C "deploy@closet.wtwr" -f ~/.ssh/closet_deploy
	```

2. Copy the public key to the server's authorized_keys for the deploy user:

	```bash
	ssh-copy-id -i ~/.ssh/closet_deploy.pub Val-in-Tech@closet.wtwr.verymad.net
	```

3. In GitHub repository Settings → Secrets and variables → Actions add the *private* key content as `DEPLOY_KEY` (the contents of `~/.ssh/closet_deploy`, not the `.pub` file). Keep the other secrets updated: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`, and `VITE_API_URL`.

Important notes about the `DEPLOY_KEY` secret
- `DEPLOY_KEY` must contain the private key in OpenSSH/PEM format. Copy the exact content, including the header and footer lines (for ed25519 it will be a single-line OpenSSH key or a multi-line PEM if using rsa). If the key is corrupted or truncated, the workflow will fail to SSH.

What the GitHub Action does
- On push to `main` (or manual `workflow_dispatch`): checks out the repo, installs dependencies in `se_project_react`, builds with `VITE_API_URL` from secrets, and uses `rsync` to copy `se_project_react/dist/` to the remote `DEPLOY_PATH`.
- After copying it attempts to run `sudo chown -R www-data:www-data` on the deployed directory and reloads nginx.

Troubleshooting
- If the SSH connection fails: verify the server has the matching public key in `~/.ssh/authorized_keys` for `DEPLOY_USER` and that the private key in `DEPLOY_KEY` matches.
- If `rsync` does not copy files: check path and permissions on the server and that `rsync` is installed.
- If nginx does not reload: check `sudo` permissions or run the reload manually as an admin.

Testing manually from your workstation
- Build locally and rsync to server to validate paths and nginx config before using Actions:

  ```bash
  # from repo root
  cd se_project_react
  npm ci
  VITE_API_URL=api.closet.wtwr.verymad.net npm run build
  rsync -avz dist/ Val-in-Tech@closet.wtwr.verymad.net:/var/www/closet.wtwr
  ssh Val-in-Tech@closet.wtwr.verymad.net 'sudo nginx -t && sudo systemctl reload nginx'
  ```

If you want, I can:
- Add more robust host-key verification to the workflow
- Use an action to upload an artifact and then run remote commands instead of rsync
- Help generate and validate a matching keypair and put the public key on the server (if you provide server access)
