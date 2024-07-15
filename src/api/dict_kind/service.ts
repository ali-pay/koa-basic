import joi from 'joi'
import type { IContext } from '@type/api'
import { DictList } from '@api/dict_list/entity'
import { DictKind } from './entity'

/**
 * 查询字典分类
 * @param ctx
 */
export async function search_dict_kind(ctx: IContext) {
  const result = await ctx.paginate(DictKind)
  ctx.success(result)
}

/**
 * 创建字典分类
 * @param ctx
 */
export async function create_dict_kind(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    label: joi.string().required(),
    sort: joi.number(),
    description: joi.string(),
    disabled: joi.boolean(),
  })

  // create
  const result = await DictKind.create(body)

  // result
  ctx.success(result)
}

/**
 * 更新字典分类
 * @param ctx
 */
export async function update_dict_kind(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
    update: joi.object().required(),
  })

  // update
  const result = await DictKind.updateManyWithDeleted({ _id: { $in: body._ids } }, body.update)

  // result
  ctx.success(result)
}

/**
 * 软删除字典分类
 * @param ctx
 */
export async function delete_dict_kind(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // 删除该分类下的字典
  await DictList.delete({ kind: { $in: body._ids } })

  // soft delete
  const result = await DictKind.delete({ _id: { $in: body._ids } }, ctx.state.user?._id)

  // result
  ctx.success(result)
}

/**
 * 硬删除字典分类
 * @param ctx
 */
export async function remove_dict_kind(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // 删除该分类下的字典
  await DictList.deleteMany({ kind: { $in: body._ids } })

  // real delete
  const result = await DictKind.deleteMany({ _id: { $in: body._ids } })

  // result
  ctx.success(result)
}
