import process from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import config from 'config'
import mongoose from 'mongoose'
import { to } from 'await-to-js'
import logger from '@util/logger'

async function initMongodb() {
  const host: string = config.get('mongodb.host')
  const port: number = config.get('mongodb.port')
  const database: string = config.get('mongodb.database')
  const username: string = config.get('mongodb.username')
  const password: string = config.get('mongodb.password')

  const uri = `mongodb://${host}:${port}/${database}`
  const options = {
    user: username,
    pass: password,
    bufferCommands: false,
    autoIndex: true,
    autoCreate: true,
  }

  logger.info(`mongodb 数据库连接：${uri}`)
  const [err] = await to(mongoose.connect(uri, options))
  if (err) {
    logger.error(err.stack)
    process.exit()
  }
  logger.info(`mongodb 数据库已连接`)

  // 动态导入 default.ts 文件
  const files = fs.readdirSync('src/api', { recursive: true }).filter(file => file.includes('default.ts'))
  for (const file of files) {
    const f = await import(path.join('src/api', file.toString()))
    const finds = await f.model.find({ _id: { $in: f.docs.map(e => e._id) } }, { _id: 1 })
    const creates = f.docs.filter(doc => !finds.some(e => String(e._id) === String(doc._id)))
    if (creates.length) {
      await f.model.create(creates)
      logger.info(`mongodb 数据表初始化：${f.model.modelName} 创建 ${creates.length} 条数据`)
    }
  }
}

export default initMongodb
