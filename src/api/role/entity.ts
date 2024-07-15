import mongoose from 'mongoose'
import type { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import mongooseDelete from 'mongoose-delete'
import type { IMenuCrud } from '@type/api'

export interface IRole extends SoftDeleteDocument {
  _id?: mongoose.Types.ObjectId
  name?: string
  code?: string
  pcMenus?: IMenuCrud[]
  appMenus?: IMenuCrud[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export const RoleSchema = new mongoose.Schema<IRole>({
  name: {
    unique: true,
    required: true,
    type: String,
  },
  code: {
    default: '',
    type: String,
  },
  pcMenus: [{
    _id: false,
    menu: String,
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
  }],
  appMenus: [{
    _id: false,
    menu: String,
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

RoleSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true, indexFields: true })

export const Role = mongoose.model<IRole, SoftDeleteModel<IRole>>('Role', RoleSchema)
