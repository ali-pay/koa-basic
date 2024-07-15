import type { Middleware } from 'koa'
import dayjs from 'dayjs'
import { ApiLog } from '@api/api_log/entity'

function koaMongodb(): Middleware {
  return async (ctx, next) => {
    // method不匹配，则跳过
    // const methods = ['POST']
    // if (!methods.includes(ctx.method)) {
    //   await next()
    //   return
    // }

    // api前缀不匹配，则跳过
    // const prefixs = ['/api/system/']
    // const prefix = ctx.path.endsWith('/') ? ctx.path : `${ctx.path}/`
    // if (!prefixs.some(e => prefix.startsWith(e))) {
    //   await next()
    //   return
    // }

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
