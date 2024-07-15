import type { Middleware } from 'koa'
import joi from 'joi'

function koaValidate(): Middleware {
  return async (ctx, next) => {
    ctx.validateParams = async (schema: joi.Schema) => {
      return await joi.object(schema).validateAsync(ctx.params)
    }
    ctx.validateBody = async (schema: joi.Schema) => {
      return await joi.object(schema).validateAsync(ctx.request.body)
    }
    ctx.validateQuery = async (schema: joi.Schema) => {
      return await joi.object(schema).validateAsync(ctx.request.query)
    }
    await next()
  }
}

export default koaValidate
