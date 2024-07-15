import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import { create_user, delete_user, remove_user, search_user, signIn, signOut, signUp, update_user } from './service'

export const router = new KoaRouter({ prefix: '/user' })

router.post('/search_user', search_user)

router.post('/create_user', koaJwt(['*']), create_user)

router.post('/update_user', koaJwt(['*']), update_user)

router.post('/delete_user', koaJwt(['*']), delete_user)

router.post('/remove_user', koaJwt(['*']), remove_user)

router.post('/signUp', signUp)

router.post('/signIn', signIn)

router.post('/signOut', koaJwt(['*']), signOut)
