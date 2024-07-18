import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import numeral from 'numeral'
import si from 'systeminformation'
import _ from 'lodash'
import { DATE_FORMAT } from '@util/constant'
import type { IContext } from '@type/api'

dayjs.extend(duration)

export async function ping(ctx: IContext) {
  ctx.success('pong')
}

export async function time(ctx: IContext) {
  ctx.success(dayjs().format(DATE_FORMAT.DATETIME))
}

export async function status(ctx: IContext) {
  const time = si.time()
  const promises: any = [si.osInfo(), si.cpuTemperature(), si.currentLoad(), si.mem(), si.fsSize()]
  const [osInfo, cpuTemperature, currentLoad, mem, fsSize] = await Promise.all(promises)
  const result = {
    time,
    osInfo,
    cpuTemperature,
    currentLoad,
    mem,
    fsSize,
  }
  ctx.success(result)
}

export async function info(ctx: IContext) {
  const time = si.time()
  const promises: any = [si.cpuTemperature(), si.fullLoad(), si.mem(), si.fsSize()]
  const [cpuTemperature, fullLoad, mem, fsSize] = await Promise.all(promises)
  const result = {
    current: dayjs(time.current).format(DATE_FORMAT.DATETIMES),
    uptime: dayjs.duration(time.uptime, 'second').format('DD:HH:mm:ss.SSS'),
    cpu: {
      use: fullLoad,
      temperature: cpuTemperature.main,
    },
    memory: {
      use: _.round(_.divide(mem.used, mem.total) * 100, 2),
      total: numeral(mem.total).format('0.00b'),
      used: numeral(mem.used).format('0.00b'),
      free: numeral(mem.free).format('0.00b'),
    },
    disks: fsSize.map((e: si.Systeminformation.FsSizeData) => {
      return {
        fs: e.fs,
        use: e.use,
        total: numeral(e.size).format('0.00b'),
        used: numeral(e.used).format('0.00b'),
        free: numeral(e.available).format('0.00b'),
      }
    }),
  }
  ctx.success(result)
}
