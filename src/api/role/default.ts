import { Role } from './entity'

export const model = Role

export const docs = [
  {
    _id: '668a0aa05ab9f9e11465c0e3',
    name: '超级管理员',
    code: 'admin',
    pcMenus: [
      {
        menu: '*',
        create: true,
        read: true,
        update: true,
        delete: true,
        _id: '668a0aa05ab9f9e11465c0e4',
      },
    ],
    appMenus: [],
    deleted: false,
    createdAt: '2024-07-07T03:25:20.305Z',
    updatedAt: '2024-07-07T03:25:20.305Z',
    __v: 0,
  },
  {
    _id: '668a0ad25658e972f00fd3fa',
    name: '普通用户',
    code: '',
    pcMenus: [
      {
        menu: '*',
        create: true,
        read: true,
        update: true,
        delete: true,
        _id: '668a0ad25658e972f00fd3fb',
      },
    ],
    appMenus: [],
    deleted: false,
    createdAt: '2024-07-07T03:26:10.849Z',
    updatedAt: '2024-07-07T03:26:10.849Z',
    __v: 0,
  },
]
