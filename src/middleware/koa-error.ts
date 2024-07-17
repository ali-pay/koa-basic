import type { Middleware } from 'koa'
import { to } from 'await-to-js'
import logger from '@util/logger'

function koaError(): Middleware {
  return async (ctx, next) => {
    const [err] = await to(next())
    if (err) {
      if (err.message.includes('in JSON at position')) {
        err.message = 'JSON 格式错误'
      }

      else if (err.message.includes('E11000 duplicate key error')) {
        err.message = err.message.replaceAll('\"', '').replaceAll('E11000 duplicate key error', '数据重复').replaceAll('collection', '数据表').replaceAll('index', '索引').replaceAll('key', '重复内容')
        err.stack = null
      }

      else if (err.message.includes('validation failed')) {
        err.message = err.message.replaceAll('validation failed', '数据表校验失败').replaceAll('Path', '字段').replaceAll('is required.', '是必填的')
        err.stack = null
      }

      else if (err.message.includes('is required')) {
        err.message = err.message.replaceAll('\"', '').replaceAll('is required', '字段是必填的')
        err.stack = null
      }

      else if (err.message.includes('must contain at least')) {
        err.message = err.message.replaceAll('\"', '').replaceAll('must contain at least', '字段是必填的，至少包含').replaceAll('items', '项')
        err.stack = null
      }

      else if (err.message.includes('is not allowed to be empty')) {
        err.message = err.message.replaceAll('\"', '').replaceAll('is not allowed to be empty', '不允许为空')
        err.stack = null
      }

      else if (err.message.includes('length must be')) {
        err.message = err.message.replaceAll('\"', '').replaceAll('length must be', '长度必须').replaceAll(' at least', '最少').replaceAll(' less than or equal to', '最多').replaceAll('characters long', '个字符')
        err.stack = null
      }

      if (err.stack) {
        logger.error(err.stack)
      }
      ctx.error(err.stack, err.message)
    }
  }
}

export default koaError
