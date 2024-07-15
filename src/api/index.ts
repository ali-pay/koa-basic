import fs from 'node:fs'
import path from 'node:path'
import type Koa from 'koa'
import KoaRouter from '@koa/router'

async function initRouter(app: Koa) {
  const router = new KoaRouter({ prefix: '/api' })

  router.get('/success', (ctx) => {
    ctx.success()
  })

  router.get('/error', (ctx) => {
    ctx.error()
  })

  router.get('/null', () => {})

  router.get('/crash', () => {
    throw new Error('系统崩溃')
  })

  // 动态导入 route.ts 文件
  const files = fs.readdirSync('src/api', { recursive: true }).filter(file => file.includes('route.ts'))
  for (const file of files) {
    const f = await import(path.join('src/api', file.toString()))
    router.use(f.router.routes())
  }

  router.all('(.*)', (ctx) => {
    ctx.error(null, '路由不存在')
  })

  app.use(router.routes())
  app.use(router.allowedMethods())

  const root = new KoaRouter()
  root.all('(.*)', (ctx) => {
    ctx.error(null, '资源不存在')
  })
  app.use(root.routes())
  app.use(root.allowedMethods())
}

export default initRouter
