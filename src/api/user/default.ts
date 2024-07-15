import { User } from './entity'

export const model = User

export const docs = [
  {
    _id: '668a0b445658e972f00fd40e',
    username: 'admin',
    password: 'ea4a9fa29d55106f7eba4bafaecb18c6ebdfabe9019f4a763bb0cf95531ed429',
    nickname: '超级管理员',
    salt: 'ali-pay',
    code: '',
    disabled: false,
    roles: [
      '668a0aa05ab9f9e11465c0e3',
    ],
    pcMenus: [],
    appMenus: [],
    deleted: false,
    createdAt: '2024-07-07T03:28:04.994Z',
    updatedAt: '2024-07-07T03:28:04.994Z',
    __v: 0,
  },
  {
    _id: '668a49717006f1e4cd4917ea',
    username: 'user',
    password: '6cd9d78df3f5cc86906c642aa6e3cba7df888f18be4353bb32a0b64905565e2e',
    nickname: '普通用户',
    salt: 'ali-pay',
    code: '',
    disabled: false,
    roles: [
      '668a0ad25658e972f00fd3fa',
    ],
    pcMenus: [],
    appMenus: [],
    deleted: false,
    createdAt: '2024-07-07T07:53:21.236Z',
    updatedAt: '2024-07-07T07:53:21.236Z',
    __v: 0,
  },
]
