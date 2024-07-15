import { URL } from 'node:url'
import https from 'node:https'
import axios from 'axios'
import dayjs from 'dayjs'
import queryString from 'query-string'
import stringify from 'safe-stable-stringify'
import { AxiosLog } from '@api/axios_log/entity'

const instance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
})

export async function GET(url: string, params: object = null, headers: object = null) {
  // 记录到数据库
  const ctx = new URL(url)
  const start = dayjs()
  const log = await AxiosLog.create({
    requestAt: start.toDate(),
    method: 'GET',
    path: ctx.pathname,
    // protocol: ctx.protocol.replaceAll(':', ''),
    // hostname: ctx.hostname,
    // host: ctx.host,
    // url: ctx.pathname,
    origin: ctx.origin,
    // href: ctx.href,
    ip: ctx.hostname,
    header: headers,
    query: queryString.parse(ctx.search),
    body: null,
  })
  const result = { code: 0, message: '成功', data: null, status: 0 }
  try {
    const resp = await instance.get(url, { params, headers })
    result.data = resp.data
    result.status = resp.status
  }
  catch (err) {
    result.code = 1
    result.message = err.message
    result.data = JSON.parse(stringify(err))
  }
  const end = dayjs()
  await AxiosLog.updateOne({ _id: log._id }, {
    responseAt: end.toDate(),
    totalTime: end.diff(start),
    status: result.status,
    result,
    length: stringify(result.data).length,
  })
  return result
}

export async function POST(url: string, body: object = null, headers: object = null) {
  // 记录到数据库
  const ctx = new URL(url)
  const start = dayjs()
  const log = await AxiosLog.create({
    requestAt: start.toDate(),
    method: 'POST',
    path: ctx.pathname,
    // protocol: ctx.protocol.replaceAll(':', ''),
    // hostname: ctx.hostname,
    // host: ctx.host,
    // url: ctx.pathname,
    origin: ctx.origin,
    // href: ctx.href,
    ip: ctx.hostname,
    header: headers,
    query: queryString.parse(ctx.search),
    body,
  })
  const result = { code: 0, message: '成功', data: null, status: 0 }
  try {
    const resp = await instance.post(url, body, { headers })
    result.data = resp.data
    result.status = resp.status
  }
  catch (err) {
    result.code = 1
    result.message = err.message
    result.data = JSON.parse(stringify(err))
  }
  const end = dayjs()
  await AxiosLog.updateOne({ _id: log._id }, {
    responseAt: end.toDate(),
    totalTime: end.diff(start),
    status: result.status,
    result,
    length: stringify(result.data).length,
  })
  return result
}
