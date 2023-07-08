module.exports = {
  apps: [
    {
      name: 'devlink-server',
      script: './dist/src/main.js',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
      },
    },
  ],
};
