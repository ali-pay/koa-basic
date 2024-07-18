import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import config from 'config'
import ip from '@util/ip'
import logger from '@util/logger'
import { WebSocket, WebSocketServer } from 'ws'
import dayjs from 'dayjs'
import { DATE_FORMAT } from './constant'

let ws: WebSocketServer = null
let wss: WebSocketServer = null

function initWebsocket() {
  const host: string = config.get('koa.host')
  const wsPort: number = config.get('koa.wsPort')
  const wssPort: number = config.get('koa.wssPort')

  // 本机ip
  const ips = ip()

  // 启动ws服务
  const httpServer = http.createServer((req, res) => res.end(dayjs().format(DATE_FORMAT.DATETIME)))
  httpServer.listen(wsPort, host, () => ips.forEach(e => logger.info(`ws      服务已启动，地址：ws://${e}:${wsPort}`)))
  ws = new WebSocketServer({ server: httpServer })
  ws.on('connection', onConnection)

  // 启动wss服务
  const options = {
    key: fs.readFileSync('ssl/私钥.pem'),
    cert: fs.readFileSync('ssl/证书.pem'),
  }
  const httpsServer = https.createServer(options, (req, res) => res.end(dayjs().format(DATE_FORMAT.DATETIME)))
  httpsServer.listen(wssPort, host, () => ips.forEach(e => logger.info(`wss     服务已启动，地址：wss://${e}:${wssPort}`)))
  wss = new WebSocketServer({ server: httpsServer })
  wss.on('connection', onConnection)
}

function onConnection(socket: WebSocket, req: http.IncomingMessage) {
  const timer = setInterval(() => socket.send(JSON.stringify({ topic: '心跳', data: { time: dayjs().format(DATE_FORMAT.DATETIME) } })), 1000)
  socket.on('close', () => clearInterval(timer))
}

export function broadcast(topic: string, data: object) {
  ws?.clients.forEach(e => e.readyState === WebSocket.OPEN && e.send(JSON.stringify({ topic, data })))
  wss?.clients.forEach(e => e.readyState === WebSocket.OPEN && e.send(JSON.stringify({ topic, data })))
}

export default initWebsocket
