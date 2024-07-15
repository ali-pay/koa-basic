import joi from 'joi'
import type { IContext } from '@type/api'
import { AxiosLog } from './entity'

/**
 * 查询axios日志
 * @param ctx
 */
export async function search_axios_log(ctx: IContext) {
  const result = await ctx.paginate(AxiosLog)
  ctx.success(result)
}

/**
 * 创建axios日志
 * @param ctx
 */
export async function create_axios_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({

  })

  // create
  const result = await AxiosLog.create(body)

  // result
  ctx.success(result)
}

/**
 * 更新axios日志
 * @param ctx
 */
export async function update_axios_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
    update: joi.object().required(),
  })

  // update
  const result = await AxiosLog.updateManyWithDeleted({ _id: { $in: body._ids } }, body.update)

  // result
  ctx.success(result)
}

/**
 * 软删除axios日志
 * @param ctx
 */
export async function delete_axios_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // soft delete
  const result = await AxiosLog.delete({ _id: { $in: body._ids } }, ctx.state.user?._id)

  // result
  ctx.success(result)
}

/**
 * 硬删除axios日志
 * @param ctx
 */
export async function remove_axios_log(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // real delete
  const result = await AxiosLog.deleteMany({ _id: { $in: body._ids } })

  // result
  ctx.success(result)
}
