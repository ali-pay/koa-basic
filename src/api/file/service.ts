import fs from 'node:fs'
import path from 'node:path'
import joi from 'joi'
import type { IContext } from '@type/api'
import { File } from './entity'

/**
 * 查询文件
 * @param ctx
 */
export async function search_file(ctx: IContext) {
  const result = await ctx.paginate(File)
  ctx.success(result)
}

/**
 * 创建文件
 * @param ctx
 */
export async function create_file(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({

  })

  // create
  const result = await File.create(body)

  // result
  ctx.success(result)
}

/**
 * 更新文件
 * @param ctx
 */
export async function update_file(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
    update: joi.object().required(),
  })

  // update
  const result = await File.updateManyWithDeleted({ _id: { $in: body._ids } }, body.update)

  // result
  ctx.success(result)
}

/**
 * 软删除文件
 * @param ctx
 */
export async function delete_file(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // soft delete
  const result = await File.delete({ _id: { $in: body._ids } }, ctx.state.user?._id)

  // result
  ctx.success(result)
}

/**
 * 硬删除文件
 * @param ctx
 */
export async function remove_file(ctx: IContext) {
  // validate
  const body = await ctx.validateBody({
    _ids: joi.array().min(1).items(joi.string().length(24)).required(),
  })

  // 删除文件
  const files = await File.find({ _id: { $in: body._ids } })
  for (const file of files) {
    fs.rmSync(file.path, { force: true })
  }

  // real delete
  const result = await File.deleteMany({ _id: { $in: body._ids } })

  // result
  ctx.success(result)
}

/**
 * 上传文件
 * @param ctx
 */
export async function upload_file(ctx: IContext) {
  if (!Array.isArray(ctx.files) || !ctx.files.length) {
    ctx.error(null, 'files字段为空')
    return
  }

  const docs = []
  for (const file of ctx.files) {
    docs.push({
      name: file.filename,
      path: file.path.replaceAll('\\', '/'),
      size: file.size,
      mimetype: file.mimetype,
      extension: path.extname(file.originalname),
      originalname: file.originalname,
    })
  }

  const result = await File.create(docs)
  ctx.success(result)
}
