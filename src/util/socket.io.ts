import type http from 'node:http'
import type htts from 'node:https'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'
import dayjs from 'dayjs'
import { DATE_FORMAT } from './constant'

let ws: Server = null
let wss: Server = null

function initSocketIo(httpServer: http.Server, httpsServer: htts.Server) {
  // 启动ws服务
  ws = new Server(httpServer)
  ws.on('connection', onConnection)

  // 启动wss服务
  wss = new Server(httpsServer)
  wss.on('connection', onConnection)
}

function onConnection(socket: Socket) {
  const timer = setInterval(() => socket.emit('心跳', { time: dayjs().format(DATE_FORMAT.DATETIME) }), 1000)
  socket.on('disconnect', () => clearInterval(timer))
}

export function broadcast(topic: string, data: object) {
  ws?.emit(topic, data)
  wss?.emit(topic, data)
}

export default initSocketIo
