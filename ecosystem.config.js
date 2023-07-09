module.exports = {
  apps: [
    {
      name: 'devlink-server',
      script: 'npm',
      args: 'run start:prod',
    },
  ],
};
// cross-env NODE_ENV=production pm2 start dist/src/main.js --name devlink-server
