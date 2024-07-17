import winston from 'winston'
import 'winston-daily-rotate-file'
import { DATE_FORMAT } from '@util/constant'

export const formats = {
  default: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({ format: DATE_FORMAT.DATETIME }),
    winston.format.printf(info => `| ${info.timestamp} | ${info.level.toUpperCase().padStart(5, ' ')} | ${info.message}`),
  ),
}

export const transports = {
  default: [
    new winston.transports.Console({ format: formats.default, handleExceptions: true }),
    new winston.transports.DailyRotateFile({
      format: formats.default,
      dirname: 'logs',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      handleExceptions: true,
    }),
  ],
}

export const logger = winston.createLogger({
  transports: transports.default,
  exitOnError: false,
})

export default logger
