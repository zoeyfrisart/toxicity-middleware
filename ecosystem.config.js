/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      name: 'toxicity-middleware',
      script: 'npm',
      args: 'start',
      interpeter: '/root/.nvm/versions/node/v14.16.1/bin/',
      exp_backoff_restart_delay: 100,
      max_memory_restart: '300M',
      time: true,
      watch: './src/app.ts',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
