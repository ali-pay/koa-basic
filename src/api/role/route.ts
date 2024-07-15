import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import { create_role, delete_role, remove_role, search_role, update_role } from './service'

export const router = new KoaRouter({ prefix: '/role' })

router.post('/search_role', search_role)

router.post('/create_role', koaJwt(['*']), create_role)

router.post('/update_role', koaJwt(['*']), update_role)

router.post('/delete_role', koaJwt(['*']), delete_role)

router.post('/remove_role', koaJwt(['*']), remove_role)
