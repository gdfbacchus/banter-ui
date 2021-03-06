module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'EasySocial',
      script: 'build/server.js',
      instances: 4,
      exec_mode: 'cluster',
      max_memory_restart: '600M',
    },
  ],
};
