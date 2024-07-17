import type { Middleware } from 'koa'
import dayjs from 'dayjs'
import { ApiLog } from '@api/api_log/entity'

function koaMongodb(): Middleware {
  return async (ctx, next) => {
    // 跳过非 POST 请求
    if (ctx.methods !== 'POST') {
      await next()
      return
    }

    // 跳过 search_ 路由
    if (ctx.path.includes('/search_')) {
      await next()
      return
    }

    // 记录到数据库
    const start = dayjs()
    const log = await ApiLog.create({
      requestAt: start.toDate(),
      method: ctx.method,
      path: ctx.path,
      // protocol: ctx.protocol,
      // hostname: ctx.hostname,
      // host: ctx.host,
      // url: ctx.url,
      origin: ctx.origin,
      // href: ctx.href,
      ip: ctx.ip.replaceAll('::ffff:', ''),
      header: ctx.header,
      query: ctx.request.query,
    })
    await next()
    const end = dayjs()
    await ApiLog.updateOne({ _id: log._id }, {
      responseAt: end.toDate(),
      totalTime: end.diff(start),
      status: ctx.status,
      result: ctx.body,
      params: ctx.params,
      body: ctx.request.body,
      length: ctx.response.length,
    })
  }
}

export default koaMongodb
