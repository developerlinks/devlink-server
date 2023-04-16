module.exports = {
  apps: [
    {
      name: 'devlink-server',
      script: './dist/src/main.js',
      cwd: '/home/ubuntu/app/devlink/devlink-server', // 使用绝对路径
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
      },
    },
  ],
};
