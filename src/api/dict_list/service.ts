import type { Types } from 'mongoose'
import joi from 'joi'
import type { IContext } from '@type/api'
import type { IDictList } from './entity'
import { DictList } from './entity'

/**
 * 查询字典列表
 * @param ctx
 */
export async function search_dict_list(ctx: IContext) {
  const result = await ctx.paginate(DictList)
  ctx.success(result)
}

/**
 * 创建字典列表
 * @param ctx
 */
export async function create_dict_list(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    label: joi.string().required(),
    value: joi.string(),
    type: joi.string(),
    render: joi.string(),
    sort: joi.number(),
    description: joi.string(),
    disabled: joi.boolean(),
    kind: joi.string().required(),
    kinds: joi.array(),
    parent: joi.string(),
    children: joi.array(),
  })

  // create
  const result = await DictList.create(body)

  // result
  ctx.success(result)
}

/**
 * 更新字典列表
 * @param ctx
 */
export async function update_dict_list(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
    update: joi.object().required(),
  })

  // update
  body.update.children = []
  const result = await DictList.updateManyWithDeleted({ _id: { $in: body._ids } }, body.update)

  // result
  ctx.success(result)
}

/**
 * 软删除字典列表
 * @param ctx
 */
export async function delete_dict_list(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // soft delete
  const result = await DictList.delete({ _id: { $in: body._ids } }, ctx.state.user?._id)

  // result
  ctx.success(result)
}

/**
 * 硬删除字典列表
 * @param ctx
 */
export async function remove_dict_list(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // real delete
  const result = await DictList.deleteMany({ _id: { $in: body._ids } })

  // result
  ctx.success(result)
}

/**
 * 查询字典列表树
 * @param ctx
 */
export async function search_dict_list_tree(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    page: joi.number().default(1).min(1),
    limit: joi.number().default(1).min(1),
    query: joi.object().default(),
    projection: joi.object().default(),
    sort: joi.object().default({ _id: -1 }),
    populate: joi.array().items(joi.string()),
    deleted: joi.boolean(),
  })

  // match sql
  const filter = {
    parent: null,
    ...body.query,
  }

  // 递归查找父节点的所有子节点
  const findChildren = async (children: IDictList[]) => {
    for (const child of children) {
      if (!child._id) {
        return
      }
      if (body.deleted) {
        child.children = await DictList.findWithDeleted({ parent: child._id }, body.projection).sort(body.sort).populate(body.populate)
      }
      else {
        child.children = await DictList.find({ parent: child._id }, body.projection).sort(body.sort).populate(body.populate)
      }
      if (child.children.length) {
        await findChildren(child.children)
      }
    }
  }

  let docs = []
  let totalDocs = 0
  if (body.deleted) {
    totalDocs = await DictList.countDocumentsWithDeleted(filter)
    docs = await DictList.findWithDeleted(filter, body.projection).limit(body.limit).skip((body.page - 1) * body.limit).sort(body.sort).populate(body.populate)
  }
  else {
    totalDocs = await DictList.countDocuments(filter)
    docs = await DictList.find(filter, body.projection).limit(body.limit).skip((body.page - 1) * body.limit).sort(body.sort).populate(body.populate)
  }
  await findChildren(docs)

  const totalPages = Math.ceil(totalDocs / body.limit) || 1
  const hasPrevPage = body.page > 1
  const hasNextPage = body.page < totalPages
  const result = {
    page: body.page,
    limit: body.limit,
    docs,
    totalDocs,
    totalPages,
    hasPrevPage,
    hasNextPage,
    pagingCounter: (body.page - 1) * body.limit + 1,
    prevPage: hasPrevPage ? body.page - 1 : null,
    nextPage: hasNextPage ? body.page + 1 : null,
  }

  // result
  ctx.success(result)
}

/**
 * 查询字典列表树（根据 parent）
 * @param ctx
 */
export async function search_dict_list_tree_by_parent(ctx: IContext) {
  const docs = await DictList.find().lean()
  for (const doc of docs) {
    if (doc.parent) {
      const parent = docs.find(e => String(e._id) === String(doc.parent._id))
      if (parent) {
        parent.children.push(doc)
      }
    }
  }
  const result = docs.filter(e => !e.parent)

  // result
  ctx.success(result)
}

/**
 * 查询字典列表树（根据 children）
 * @param ctx
 */
export async function search_dict_list_tree_by_children(ctx: IContext) {
  const subdocs: Types.ObjectId[] = []
  const docs = await DictList.find().lean()
  for (const doc of docs) {
    if (doc.children.length) {
      doc.children = docs.filter((e) => {
        const flag = doc.children.map(e => String(e._id)).includes(String(e._id))
        if (flag) {
          subdocs.push(e._id)
        }
        return flag
      })
    }
  }
  const result = docs.filter(e => !subdocs.map(e => String(e._id)).includes(String(e._id)))

  // result
  ctx.success(result)
}
