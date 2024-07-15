import mongoose from 'mongoose'
import type { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import mongooseDelete from 'mongoose-delete'

export interface IAxiosLog extends SoftDeleteDocument {
  _id?: mongoose.Types.ObjectId
  method?: string
  path?: string
  protocol?: string
  hostname?: string
  host?: string
  url?: string
  origin?: string
  href?: string
  ip?: string
  status?: number
  totalTime?: number
  length?: number
  header?: any
  params?: any
  query?: any
  body?: any
  result?: any
  requestAt?: Date
  responseAt?: Date
  expireAt?: Date
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export const AxiosLogSchema = new mongoose.Schema<IAxiosLog>({
  method: {
    index: true,
    required: true,
    type: String,
  },
  path: {
    index: true,
    required: true,
    type: String,
  },
  protocol: {
    default: '',
    type: String,
  },
  hostname: {
    default: '',
    type: String,
  },
  host: {
    default: '',
    type: String,
  },
  url: {
    default: '',
    type: String,
  },
  origin: {
    default: '',
    type: String,
  },
  href: {
    default: '',
    type: String,
  },
  ip: {
    index: true,
    default: '',
    type: String,
  },
  status: {
    default: 0,
    type: Number,
  },
  totalTime: {
    default: 0,
    type: Number,
  },
  length: {
    default: 0,
    type: Number,
  },
  header: {
    default: null,
    type: mongoose.Schema.Types.Mixed,
  },
  params: {
    default: null,
    type: mongoose.Schema.Types.Mixed,
  },
  query: {
    default: null,
    type: mongoose.Schema.Types.Mixed,
  },
  body: {
    default: null,
    type: mongoose.Schema.Types.Mixed,
  },
  result: {
    default: null,
    type: mongoose.Schema.Types.Mixed,
  },
  requestAt: {
    default: null,
    type: Date,
  },
  responseAt: {
    default: null,
    type: Date,
  },
  expireAt: {
    default: Date.now,
    type: Date,
    expires: '30d',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

AxiosLogSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true, indexFields: true })

export const AxiosLog = mongoose.model<IAxiosLog, SoftDeleteModel<IAxiosLog>>('AxiosLog', AxiosLogSchema)
