export default {
  mode: 'development',
  salt: 'ali-pay',
  koa: {
    host: '0.0.0.0',
    httpPort: 8000,
    httpsPort: 9000,
    wsPort: 8001,
    wssPort: 9001,
  },
  mongodb: {
    host: '127.0.0.1',
    port: 27017,
    database: 'koa-basic',
    username: '',
    password: '',
  },
}
