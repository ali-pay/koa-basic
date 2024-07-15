import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import { create_dict_kind, delete_dict_kind, remove_dict_kind, search_dict_kind, update_dict_kind } from './service'

export const router = new KoaRouter({ prefix: '/dict_kind' })

router.post('/search_dict_kind', search_dict_kind)

router.post('/create_dict_kind', koaJwt(['*']), create_dict_kind)

router.post('/update_dict_kind', koaJwt(['*']), update_dict_kind)

router.post('/delete_dict_kind', koaJwt(['*']), delete_dict_kind)

router.post('/remove_dict_kind', koaJwt(['*']), remove_dict_kind)
