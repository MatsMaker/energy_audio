module.exports = {
  port: 8080,
  secret: 'SEKRT43',
  top: 5,
  redis: {
    host: 'localhost',
    port: 6379,
    sessPrefix: 'sess',
    userPrefix: 'user',
    audioDataPrefix: 'audioData',
  },
}
