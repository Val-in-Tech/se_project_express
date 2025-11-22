# Deploying the Express API (CORS + nginx)

This file explains how to deploy the backend so the frontend at
`https://closet.wtwr.verymad.net` can call `https://api.closet.wtwr.verymad.net`.

1) Set environment variables

Create an `.env` file in the `se_project_express` folder (or set env vars via your service manager):

```
FRONTEND_ORIGIN=https://closet.wtwr.verymad.net
PORT=3001
# Optional:
# MONGO_URI=mongodb://127.0.0.1:27017/wtwr_db
```

2) Ensure CORS is enabled in `app.js`

The project already includes an explicit CORS configuration that allows the `Authorization` header and handles OPTIONS preflight. If you've pulled the latest code, you should see `corsOptions` in `app.js`:

```js
const corsOptions = {
  origin: (origin, cb) => {
    const allowed = ['https://closet.wtwr.verymad.net'];
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
```

3) Start the server (example using systemd or PM2)

Quick manual start (SSH):

```bash
cd /path/to/se_project_express
npm install        # first time
export FRONTEND_ORIGIN='https://closet.wtwr.verymad.net'
export PORT=3001
npm run start
```

Using `pm2` (recommended for production):

```bash
pm2 start app.js --name closet-api --env production
pm2 save
```

Or create a `systemd` unit file `/etc/systemd/system/closet-api.service`:

```
[Unit]
Description=Closet API
After=network.target

[Service]
Environment=FRONTEND_ORIGIN=https://closet.wtwr.verymad.net
Environment=PORT=3001
WorkingDirectory=/path/to/se_project_express
ExecStart=/usr/bin/node app.js
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now closet-api.service
```

4) nginx configuration (API reverse proxy or CORS handling)

If you serve the frontend from `closet.wtwr.verymad.net` and the API on `api.closet.wtwr.verymad.net`, you can either let Express add CORS headers (preferred) or configure nginx to add them.

Example nginx site for the API subdomain (place in `/etc/nginx/sites-available/api.closet`):

```
server {
  listen 80;
  server_name api.closet.wtwr.verymad.net;

  location / {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Add CORS headers here if you prefer nginx to set them
    add_header 'Access-Control-Allow-Origin' 'https://closet.wtwr.verymad.net' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type' always;
  }

  # Let nginx respond to OPTIONS preflight quickly
  if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' 'https://closet.wtwr.verymad.net';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type';
    return 204;
  }
}
```

Reload nginx after enabling the site:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

5) Verify CORS from a remote machine

From any machine (or your local dev machine), check the preflight and GET responses:

```bash
curl -i -X OPTIONS 'https://api.closet.wtwr.verymad.net/items' \
  -H 'Origin: https://closet.wtwr.verymad.net' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: Authorization,Content-Type'

curl -i 'https://api.closet.wtwr.verymad.net/items' -H 'Origin: https://closet.wtwr.verymad.net'
```

Look for `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` in the response.

6) Troubleshooting

- If you still see `No 'Access-Control-Allow-Origin' header is present`, the response reaching the browser lacks the header. Check whether a caching layer, CDN, or load balancer strips headers.
- If `curl` shows the header but the browser still blocks the request, inspect the OPTIONS preflight response specifically.
- Ensure HTTPS is configured for production (use certbot or your CA). Browsers may block mixed-content requests.

Contact / next steps

If you want, I can:

- prepare a one-click `systemd` unit or `pm2` instructions tailored to your server user and paths;
- produce a PR with a small `deploy/` script or CI steps to build and publish the backend and frontend;
- or prepare the nginx config as a final file and test commands.
