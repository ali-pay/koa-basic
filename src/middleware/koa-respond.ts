import type { Middleware } from 'koa'
import lodash from 'lodash'

function koaRespond(): Middleware {
  return async (ctx, next) => {
    ctx.success = (data = null, message = '成功', code = 0) => {
      ctx.body = {
        code,
        message,
        data,
      }
    }
    ctx.error = (data = null, message = '失败', code = 1) => {
      ctx.body = {
        code,
        message,
        data,
      }
    }
    await next()
    if (['HEAD', 'OPTIONS'].includes(ctx.method)) {
      return
    }
    if (!ctx.body) {
      ctx.body = {
        code: 2,
        message: '没有应答数据',
        data: null,
      }
    }
    if (!lodash.isObject(ctx.body) || !['code', 'message', 'data'].every(key => lodash.keys(ctx.body).includes(key))) {
      ctx.body = {
        code: 3,
        message: `应答数据不合规`,
        data: ctx.body,
      }
    }
    // ctx.status = 200
  }
}

export default koaRespond
