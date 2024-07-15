import mongoose from 'mongoose'
import type { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import mongooseDelete from 'mongoose-delete'

export interface IFile extends SoftDeleteDocument {
  _id?: mongoose.Types.ObjectId
  name?: string
  path?: string
  size?: number
  mimetype?: string
  extension?: string
  originalname?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export const FileSchema = new mongoose.Schema<IFile>({
  name: {
    required: true,
    type: String,
  },
  path: {
    default: '',
    type: String,
  },
  size: {
    default: 0,
    type: Number,
  },
  mimetype: {
    default: '',
    type: String,
  },
  extension: {
    default: '',
    type: String,
  },
  originalname: {
    default: '',
    type: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

FileSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true, indexFields: true })

export const File = mongoose.model<IFile, SoftDeleteModel<IFile>>('File', FileSchema)
