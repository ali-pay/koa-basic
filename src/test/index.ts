import fs from 'node:fs'
import path from 'node:path'

async function autoImport() {
  // 动态导入文件
  const files = fs.readdirSync('src/test', { recursive: true }).filter(file => file !== 'index.ts')
  for (const file of files) {
    await import(path.join('src/test', file.toString()))
  }
}

autoImport()
