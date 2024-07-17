import type { Middleware } from 'koa'
import dayjs from 'dayjs'
import prettyMilliseconds from 'pretty-ms'
import logger from '@util/logger'

function koaLogger(): Middleware {
  return async (ctx, next) => {
    const start = dayjs()
    await next()
    logger.info(`${prettyMilliseconds(dayjs().diff(start)).padStart(6, ' ')} | ${ctx.method.padStart(7, ' ')} | ${ctx.path}`)
  }
}

export default koaLogger
