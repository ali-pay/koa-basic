import type Koa from 'koa'
import koaStatic from 'koa-static'
import koaCors from '@koa/cors'
import koaBodyparser from '@koa/bodyparser'
import koaRespond from '@middleware/koa-respond'
import koaLogger from '@middleware/koa-logger'
import koaError from '@middleware/koa-error'
import koaValidate from '@middleware/koa-validate'
import koaPaginate from '@middleware/koa-paginate'
import koaMongodb from '@middleware/koa-mongodb'
import koaQueue from '@middleware/koa-queue'

async function initMiddleware(app: Koa) {
  // allow static file
  app.use(koaStatic('public'))
  app.use(koaStatic('uploads'))
  app.use(koaStatic('logs'))

  // add route log
  app.use(koaLogger())

  // add mongodb log
  app.use(koaMongodb())

  // add function: ctx.success & ctx.error
  app.use(koaRespond())

  // add function: ctx.validate
  app.use(koaValidate())

  // add function: ctx.paginate
  app.use(koaPaginate())

  // catch error
  app.use(koaError())

  // allow cors
  app.use(koaCors())

  // body parser
  app.use(koaBodyparser())

  // catch request limit
  app.use(koaQueue())
}

export default initMiddleware
