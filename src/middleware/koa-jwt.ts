import type { Middleware } from 'koa'
import config from 'config'
import dayjs from 'dayjs'
import jsonwebtoken from 'jsonwebtoken'
import type { IRole } from '@api/role/entity'
import { DATE_FORMAT } from '@util/constant'

/**
 * 接口访问权限校验
 * - 入参为空         代表任何人都能访问
 * - 入参包含 `*`     代表任何登录用户都能访问
 * - 角色包含 `admin` 代表任何接口都能访问
 * @param roles 角色的 code
 * @returns 中间件
 */
function koaJwt(roles?: string[]): Middleware {
  return async (ctx, next) => {
    if (roles?.length) {
      try {
        const authorization = ctx.headers.authorization || ''
        const token = authorization.split(' ').pop()
        const salt: string = config.get('salt')
        ctx.state.user = jsonwebtoken.verify(token, salt)
        const userRoles: string[] = ctx.state.user.roles.map((e: IRole) => e.code)
        if (!roles.includes('*') && !userRoles.includes('admin') && !userRoles.some(e => roles.includes(e))) {
          throw new Error('Role Forbidden')
        }
      }
      catch (err) {
        let message = 'TOKEN 未知错误'
        if (err.message.includes('jwt must be provided')) {
          message = 'TOKEN 未传入'
        }
        else if (err.message.includes('jwt expired')) {
          message = 'TOKEN 过期'
          err.expiredAt = dayjs(err.expiredAt).format(DATE_FORMAT.DATETIME)
        }
        else if (err.message.includes('invalid token')) {
          message = 'TOKEN 无效'
        }
        else if (err.message.includes('invalid signature')) {
          message = 'TOKEN 签名无效'
        }
        else if (err.message.includes('jwt malformed')) {
          message = 'TOKEN 格式无效'
        }
        else if (err.message.includes('in JSON at position')) {
          message = 'TOKEN 内容无效'
        }
        ctx.error(err, message)
        return
      }
    }
    await next()
  }
}

export default koaJwt
