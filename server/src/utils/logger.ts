import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard',
    },
  },
  level: process.env.PINO_LOG_LEVEL || 'info',
})

export default logger
