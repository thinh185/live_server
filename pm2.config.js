module.exports = {
  name: 'live_server',
  script: './server.js',
  watch: false,
  env_production: {
    NODE_ENV: 'product'
  },
  // max_memory_restart: "512M",
  exec_mode : 'cluster',
  instances  : 4,
  watch:true
};
