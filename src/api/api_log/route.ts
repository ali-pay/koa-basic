import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import { create_api_log, delete_api_log, remove_api_log, search_api_log, update_api_log } from './service'

export const router = new KoaRouter({ prefix: '/api_log' })

router.post('/search_api_log', search_api_log)

router.post('/create_api_log', koaJwt(['*']), create_api_log)

router.post('/update_api_log', koaJwt(['*']), update_api_log)

router.post('/delete_api_log', koaJwt(['*']), delete_api_log)

router.post('/remove_api_log', koaJwt(['*']), remove_api_log)
