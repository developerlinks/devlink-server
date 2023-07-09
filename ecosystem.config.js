module.exports = {
  apps: [
    {
      name: 'devlink-server',
      script: 'npm',
      args: 'run start:prod',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
