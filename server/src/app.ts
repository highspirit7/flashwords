import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { renderTrpcPanel } from 'trpc-panel'
import PinoHttp from 'pino-http'

import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import { appRouter } from './controllers'
import config, { corsOptions } from './config'
import type { Database } from './database'
import type { Context } from './trpc'
import logger from './utils/logger'

export default function createApp(db: Database) {
  const app = express()

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser())
  app.use(
    PinoHttp({
      logger,
      customLogLevel(req, res, error) {
        if (res.statusCode >= 500 || error) {
          return 'error'
        }
        if (res.statusCode >= 400) {
          return 'warn'
        }
        return 'silent'
      },
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
          headers: {
            'user-agent': req.headers['user-agent'],
          },
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    })
  )
  // Endpoint for health checks - pinging the server to see if it's alive.
  // This can be used by tests, load balancers, monitoring tools, etc.
  app.use('/api/health', (_, res) => {
    res.status(200).send('OK')
  })

  // Using TRPC router, which will live under /api/v1/trpc
  // path. It will be used for all our procedures.
  app.use(
    '/api/v1/trpc',
    createExpressMiddleware({
      // Created context for each request, which we will be able to
      // access in our procedures.
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        // What we provide to our procedures under `ctx` key.
        db,
        req,
        res,
      }),

      // all routes
      router: appRouter,
    })
  )

  if (config.env === 'development') {
    app.use('/api/v1/trpc-panel', (_, res) =>
      res.send(
        renderTrpcPanel(appRouter, {
          url: `http://localhost:${config.port}/api/v1/trpc`,
          transformer: 'superjson',
        })
      )
    )
  }

  return app
}
