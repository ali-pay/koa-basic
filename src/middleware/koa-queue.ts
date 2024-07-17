import type { Middleware } from 'koa'

const queue: { path: string, lock: boolean, reqs: ((value: unknown) => void)[] }[] = []

async function waitingClose(path: string) {
  let found = queue.find(e => e.path === path)
  if (!found) {
    found = { path, lock: false, reqs: [] }
    queue.push(found)
  }

  if (found.lock) {
    return new Promise((resolve) => {
      found.reqs.push(resolve)
    })
  }

  found.lock = true

  return Promise.resolve()
}

function koaQueue(): Middleware {
  return async (ctx, next) => {
    ctx.res.on('close', () => {
      const found = queue.find(e => e.path === ctx.path)
      if (!found) {
        return
      }
      if (found.reqs.length) {
        found.reqs.shift()(null)
      }
      else {
        found.lock = false
      }
    })

    await waitingClose(ctx.path)

    await next()
  }
}

export default koaQueue
