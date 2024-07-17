import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import koaQueue from '@middleware/koa-queue'
import { info, ping, status, time } from './service'

export const router = new KoaRouter({ prefix: '/system' })

router.get('/ping', ping)

router.get('/time', time)

router.get('/status', koaJwt(), status)

router.get('/info', koaQueue(), koaJwt(['*']), info)
