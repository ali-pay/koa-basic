import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import config from 'config'
import Koa from 'koa'
import ip from '@util/ip'
import logger from '@util/logger'
import initRouter from '@api/index'
import initMiddleware from '@middleware/index'
import initMongodb from '@util/mongodb'
import initSocketIo from '@util/socket.io'
import initWebsocket from '@util/websocket'
import './test'

async function bootstrap() {
  const mode: string = config.get('mode')
  const host: string = config.get('koa.host')
  const httpPort: number = config.get('koa.httpPort')
  const httpsPort: number = config.get('koa.httpsPort')

  logger.info(`环境配置：${mode}`)

  const app = new Koa()

  // 初始化中间件
  await initMiddleware(app)

  // 初始化路由
  await initRouter(app)

  // 初始化数据库
  await initMongodb()

  // 本机ip
  const ips = ip()

  // 启动http服务
  const httpServer = http.createServer(app.callback())
  httpServer.listen(httpPort, host, () => ips.forEach(e => logger.info(`http    服务已启动，地址：http://${e}:${httpPort}`)))

  // 启动https服务
  const options = {
    key: fs.readFileSync('ssl/私钥.pem'),
    cert: fs.readFileSync('ssl/证书.pem'),
  }
  const httpsServer = https.createServer(options, app.callback())
  httpsServer.listen(httpsPort, host, () => ips.forEach(e => logger.info(`https   服务已启动，地址：https://${e}:${httpsPort}`)))

  // 启动socket.io服务
  initSocketIo(httpServer, httpsServer)

  // 启动websocket服务
  initWebsocket()
}

bootstrap()
