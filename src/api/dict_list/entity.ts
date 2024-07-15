import mongoose from 'mongoose'
import mongooseAutopopulate from 'mongoose-autopopulate'
import mongooseSequence from 'mongoose-sequence'
import type { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete'
import mongooseDelete from 'mongoose-delete'
import type { IDictKind } from '@api/dict_kind/entity'

export interface IDictList extends SoftDeleteDocument {
  _id?: mongoose.Types.ObjectId
  label?: string
  value?: string
  type?: string
  render?: string
  sort?: number
  description?: string
  disabled?: boolean
  kind?: mongoose.Types.ObjectId
  kinds?: (mongoose.Types.ObjectId | IDictKind)[]
  parent?: mongoose.Types.ObjectId | IDictList
  children?: IDictList[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export const DictListSchema = new mongoose.Schema<IDictList>({
  label: {
    index: true,
    required: true,
    type: String,
  },
  value: {
    default: '',
    type: String,
  },
  type: {
    /**
     * 参考 Excel 数据类型
     * - 文本: String
     * - 数值: Number
     * - 日期: Date
     * - 逻辑: Boolean
     */
    enum: ['文本', '数值', '日期', '逻辑'],
    default: '文本',
    type: String,
  },
  render: {
    /**
     * 参考 Element Plus 组件类型
     * - 输入框: Input
     * - 选择器: Select
     * - 多选框: Checkbox
     * - 单选框: Radio
     * - 日期时间选择器: DateTimePicker
     */
    enum: ['', '输入框', '选择器', '多选框', '单选框', '日期时间选择器'],
    default: '',
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
  kind: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DictKind',
    autopopulate: false,
  },
  kinds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DictKind',
    autopopulate: false,
  }],
  parent: {
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DictList',
    autopopulate: false,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DictList',
    autopopulate: false,
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

// @ts-expect-error https://stackoverflow.com/a/71859686
DictListSchema.plugin(mongooseSequence(mongoose), { inc_field: 'dict_list_id' })

DictListSchema.plugin(mongooseAutopopulate)

DictListSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true, indexFields: true })

export const DictList = mongoose.model<IDictList, SoftDeleteModel<IDictList>>('DictList', DictListSchema)
