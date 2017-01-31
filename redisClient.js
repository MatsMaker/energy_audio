const redis = require('redis');
const config = require('./app.config');

module.exports = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});
