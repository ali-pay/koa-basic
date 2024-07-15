import joi from 'joi'
import type { IContext } from '@type/api'
import { Role } from './entity'

/**
 * 查询角色
 * @param ctx
 */
export async function search_role(ctx: IContext) {
  const result = await ctx.paginate(Role)
  ctx.success(result)
}

/**
 * 创建角色
 * @param ctx
 */
export async function create_role(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    name: joi.string().required(),
    code: joi.string(),
    pcMenus: joi.array(),
    appMenus: joi.array(),
  })

  // create
  const result = await Role.create(body)

  // result
  ctx.success(result)
}

/**
 * 更新角色
 * @param ctx
 */
export async function update_role(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
    update: joi.object().required(),
  })

  // update
  const result = await Role.updateManyWithDeleted({ _id: { $in: body._ids } }, body.update)

  // result
  ctx.success(result)
}

/**
 * 软删除角色
 * @param ctx
 */
export async function delete_role(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // soft delete
  const result = await Role.delete({ _id: { $in: body._ids } }, ctx.state.user?._id)

  // result
  ctx.success(result)
}

/**
 * 硬删除角色
 * @param ctx
 */
export async function remove_role(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // real delete
  const result = await Role.deleteMany({ _id: { $in: body._ids } })

  // result
  ctx.success(result)
}
