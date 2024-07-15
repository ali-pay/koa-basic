import mongoose from 'mongoose'
import type { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import mongooseDelete from 'mongoose-delete'
import type { IMenuCrud } from '@type/api'
import type { IRole } from '@api/role/entity'

export interface IUser extends SoftDeleteDocument {
  _id?: mongoose.Types.ObjectId
  username?: string
  password?: string
  nickname?: string
  salt?: string
  code?: string
  disabled?: boolean
  roles?: (mongoose.Types.ObjectId | IRole)[]
  pcMenus?: IMenuCrud[]
  appMenus?: IMenuCrud[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export const UserSchema = new mongoose.Schema<IUser>({
  username: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  nickname: {
    default: '',
    type: String,
  },
  salt: {
    required: true,
    type: String,
  },
  code: {
    default: '',
    type: String,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    autopopulate: true,
  }],
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

UserSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true, indexFields: true })

export const User = mongoose.model<IUser, SoftDeleteModel<IUser>>('User', UserSchema)
