module.exports = {
  apps : [{
    name: 'fb-api',
    script: 'dist/main.js',
    instances: 2,
    mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '3G',
    env: {
      NODE_ENV: 'dev'
    }

  }
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
