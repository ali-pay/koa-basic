import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import { create_user, delete_user, profile, remove_user, search_user, sign_in, sign_out, sign_up, update_user } from './service'

export const router = new KoaRouter({ prefix: '/user' })

router.post('/search_user', search_user)

router.post('/create_user', koaJwt(['*']), create_user)

router.post('/update_user', koaJwt(['*']), update_user)

router.post('/delete_user', koaJwt(['*']), delete_user)

router.post('/remove_user', koaJwt(['*']), remove_user)

router.post('/sign_up', sign_up)

router.post('/sign_in', sign_in)

router.post('/sign_out', koaJwt(['*']), sign_out)

router.get('/profile', koaJwt(['*']), profile)
