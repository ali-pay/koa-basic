import joi from 'joi'
import config from 'config'
import crypto from 'crypto-js'
import jsonwebtoken from 'jsonwebtoken'
import type { IContext } from '@type/api'
import { User } from './entity'

/**
 * 查询用户
 * @param ctx
 */
export async function search_user(ctx: IContext) {
  const result = await ctx.paginate(User)
  ctx.success(result)
}

/**
 * 创建用户
 * @param ctx
 */
export async function create_user(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    username: joi.string().required(),
    password: joi.string().required(),
    nickname: joi.string(),
    code: joi.string(),
    disabled: joi.boolean(),
    roles: joi.array(),
  })

  // 密码加盐
  body.salt = config.get('salt')
  body.password = crypto.HmacSHA256(body.password, body.salt).toString()

  // create
  const result = await User.create(body)

  // result
  ctx.success(result)
}

/**
 * 更新用户
 * @param ctx
 */
export async function update_user(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
    update: joi.object().required(),
  })

  // update
  const result = await User.updateManyWithDeleted({ _id: { $in: body._ids } }, body.update)

  // result
  ctx.success(result)
}

/**
 * 软删除用户
 * @param ctx
 */
export async function delete_user(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // soft delete
  const result = await User.delete({ _id: { $in: body._ids } }, ctx.state.user?._id)

  // result
  ctx.success(result)
}

/**
 * 硬删除用户
 * @param ctx
 */
export async function remove_user(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // real delete
  const result = await User.deleteMany({ _id: { $in: body._ids } })

  // result
  ctx.success(result)
}

/**
 * 注册
 * @param ctx
 */
export async function signUp(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    username: joi.string().required().min(1),
    password: joi.string().required().min(6),
    nickname: joi.string(),
    code: joi.string(),
    disabled: joi.boolean(),
    roles: joi.array(),
    pcMenus: joi.array(),
    appMenus: joi.array(),
  })

  const exists = await User.exists({ username: body.username })
  if (exists) {
    ctx.error(null, '账号已存在')
    return
  }

  // 密码加盐
  body.salt = config.get('salt')
  body.password = crypto.HmacSHA256(body.password, body.salt).toString()

  // create
  const result = await User.create(body)

  // result
  ctx.success(result)
}

/**
 * 登录
 * @param ctx
 */
export async function signIn(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    username: joi.string().required(),
    password: joi.string().required(),
  })

  const user = await User.findOne({ username: body.username }, { username: 1, nickname: 1, code: 1, disabled: 1, roles: 1, pcMenus: 1, appMenus: 1, password: 1, salt: 1 })
    .populate({ path: 'roles', select: ['name', 'code', 'pcMenus', 'appMenus'] })
  if (!user) {
    ctx.error(null, '账号错误')
    return
  }

  const password = crypto.HmacSHA256(body.password, user.salt).toString()
  if (password !== user.password) {
    ctx.error(null, '密码错误')
    return
  }

  if (user.disabled) {
    ctx.error(null, '账号已禁用')
    return
  }

  const salt: string = config.get('salt')
  const token = jsonwebtoken.sign(user.toObject(), salt, { expiresIn: '30d' })
  const result = {
    user,
    token,
  }
  ctx.success(result)
}

/**
 * 退出
 * @param ctx
 */
export async function signOut(ctx: IContext) {
  ctx.success(ctx.state.user)
}
