module.exports = {
  apps: [
    {
      name: 'devlink-server',
      script: 'npm',
      args: 'run start:prod',
      interpreter: "/home/ubuntu/.nvm/versions/node/v18.16.1/bin/node",
    },
  ],
};
// cross-env NODE_ENV=production pm2 start dist/src/main.js --name devlink-server
