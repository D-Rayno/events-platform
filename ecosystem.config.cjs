// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'g-agency-events',
      script: './build/bin/server.js',
      instances: 1, // Single instance for Render free tier
      exec_mode: 'fork', // Fork mode (not cluster) for better compatibility
      autorestart: true,
      watch: false,
      max_memory_restart: '512M', // Render free tier has 512MB RAM
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3333,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
      
      // Auto-restart on these conditions
      min_uptime: '10s',
      max_restarts: 10,
      
      // Cron restart (optional - restart daily at 3 AM)
      cron_restart: '0 3 * * *',
      
      // Environment-specific settings
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/avoid',
      repo: 'git@github.com:D-Rayno/g-agency-events.git',
      path: '/var/www/g-agency-events',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.cjs --env production',
    },
  },
}