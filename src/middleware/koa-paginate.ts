import type { Middleware } from 'koa'
import type { SoftDeleteModel } from 'mongoose-delete'
import joi from 'joi'

function koaPaginate(): Middleware {
  return async (ctx, next) => {
    ctx.paginate = async (model: SoftDeleteModel<any>) => {
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
        ...body.query,
      }

      let docs = []
      let totalDocs = 0
      if (body.deleted) {
        docs = await model.findWithDeleted(filter, body.projection).limit(body.limit).skip((body.page - 1) * body.limit).sort(body.sort).populate(body.populate)
        totalDocs = await model.countDocumentsWithDeleted(filter)
      }
      else {
        docs = await model.find(filter, body.projection).limit(body.limit).skip((body.page - 1) * body.limit).sort(body.sort).populate(body.populate)
        totalDocs = await model.countDocuments(filter)
      }

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
      return result
    }
    await next()
  }
}

export default koaPaginate
