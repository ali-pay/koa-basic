import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import { create_axios_log, delete_axios_log, remove_axios_log, search_axios_log, update_axios_log } from './service'

export const router = new KoaRouter({ prefix: '/axios_log' })

router.post('/search_axios_log', search_axios_log)

router.post('/create_axios_log', koaJwt(['*']), create_axios_log)

router.post('/update_axios_log', koaJwt(['*']), update_axios_log)

router.post('/delete_axios_log', koaJwt(['*']), delete_axios_log)

router.post('/remove_axios_log', koaJwt(['*']), remove_axios_log)
