import type { Middleware } from 'koa'
import dayjs from 'dayjs'
import logger from '@util/logger'

function koaLogger(): Middleware {
  return async (ctx, next) => {
    const start = dayjs()
    await next()
    logger.info(`[${ctx.method.padStart(6, ' ')}] [${dayjs().diff(start).toString().padStart(5, ' ')}ms] ${ctx.path}`)
  }
}

export default koaLogger
