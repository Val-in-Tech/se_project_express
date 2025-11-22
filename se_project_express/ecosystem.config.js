module.exports = {
  apps: [
    {
      name: 'wtwr-api',
      script: 'app.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
