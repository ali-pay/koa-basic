import type { Context } from 'koa'
import type { SoftDeleteModel } from 'mongoose-delete'
import type { DeleteResult, UpdateResult } from 'mongodb'

export interface IContext extends Context {
  success: (data?: any, message?: string, code?: number) => void
  error: (data?: any, message?: string, code?: number) => void
  validateParams: (schema: any) => Promise<any>
  validateBody: (schema: any) => Promise<any>
  validateQuery: (schema: any) => Promise<any>
  paginate: (model: SoftDeleteModel<any>) => Promise<IPaginateResult<any>>
}

/**
 * 分页查询请求
 */
export interface IPaginateRequest {
  page: number
  limit: number
  query?: object
  projection?: Record<string, 0 | 1>
  sort?: Record<string, 1 | -1>
  populate?: string[]
  deleted?: boolean
}

/**
 * 分页查询结果
 */
export interface IPaginateResult<T> {
  page: number
  limit: number
  docs: T[]
  totalDocs: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  pagingCounter: number
  prevPage: number
  nextPage: number
}

/**
 * 更新结果
 */
export interface IUpdateResult extends UpdateResult {}

/**
 * 删除结果
 */
export interface IDeleteResult extends DeleteResult {}

/**
 * 应答结果
 */
export interface IResult<T> {
  code: number
  message: string
  data: T
}

/**
 * 菜单权限
 */
export interface IMenuCrud {
  menu: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}
