import type { Middleware } from 'koa'
import dayjs from 'dayjs'
import logger from '@util/logger'

function koaLogger(): Middleware {
  return async (ctx, next) => {
    const start = dayjs()
    await next()
    logger.info(`${ctx.status} ${ctx.method} ${ctx.path} ${dayjs().diff(start)}ms`)
  }
}

export default koaLogger
