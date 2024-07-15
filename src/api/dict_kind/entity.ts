import mongoose from 'mongoose'
import mongooseAutopopulate from 'mongoose-autopopulate'
import mongooseSequence from 'mongoose-sequence'
import type { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import mongooseDelete from 'mongoose-delete'

export interface IDictKind extends SoftDeleteDocument {
  _id?: mongoose.Types.ObjectId
  label?: string
  sort?: number
  description?: string
  disabled?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export const DictKindSchema = new mongoose.Schema<IDictKind>({
  label: {
    unique: true,
    required: true,
    type: String,
  },
  sort: {
    min: 0,
    max: 999,
    default: 0,
    type: Number,
  },
  description: {
    default: '',
    type: String,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

// @ts-expect-error https://stackoverflow.com/a/71859686
DictKindSchema.plugin(mongooseSequence(mongoose), { inc_field: 'dict_kind_id' })

DictKindSchema.plugin(mongooseAutopopulate)

DictKindSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true, indexFields: true })

export const DictKind = mongoose.model<IDictKind, SoftDeleteModel<IDictKind>>('DictKind', DictKindSchema)
