/**
 * PM2 process file — chạy `pm2 start ecosystem.config.js` sau khi build.
 * Xem hướng dẫn đầy đủ: docs/DEPLOY_PM2.md
 */
module.exports = {
  apps: [
    {
      name: "wedding",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3003",
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
