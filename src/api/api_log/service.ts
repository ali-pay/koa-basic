import joi from 'joi'
import type { IContext } from '@type/api'
import { ApiLog } from './entity'

/**
 * 查询api日志
 * @param ctx
 */
export async function search_api_log(ctx: IContext) {
  const result = await ctx.paginate(ApiLog)
  ctx.success(result)
}

/**
 * 创建api日志
 * @param ctx
 */
export async function create_api_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({

  })

  // create
  const result = await ApiLog.create(body)

  // result
  ctx.success(result)
}

/**
 * 更新api日志
 * @param ctx
 */
export async function update_api_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
    update: joi.object().required(),
  })

  // update
  const result = await ApiLog.updateManyWithDeleted({ _id: { $in: body._ids } }, body.update)

  // result
  ctx.success(result)
}

/**
 * 软删除api日志
 * @param ctx
 */
export async function delete_api_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // soft delete
  const result = await ApiLog.delete({ _id: { $in: body._ids } }, ctx.state.user?._id)

  // result
  ctx.success(result)
}

/**
 * 硬删除api日志
 * @param ctx
 */
export async function remove_api_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // real delete
  const result = await ApiLog.deleteMany({ _id: { $in: body._ids } })

  // result
  ctx.success(result)
}
