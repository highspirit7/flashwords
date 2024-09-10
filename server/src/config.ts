import type { CorsOptions } from 'cors'
import 'dotenv/config'
import { z } from 'zod'

const { env } = process

if (!env.NODE_ENV) env.NODE_ENV = 'development'

// force UTC timezone, so it matches the default timezone in production
env.TZ = 'UTC'

const isTest = env.NODE_ENV === 'test'
const isProd = env.NODE_ENV === 'production'
// const isDevTest = env.NODE_ENV === 'development' || isTest

const schema = z
  .object({
    env: z
      .enum(['development', 'production', 'staging', 'test'])
      .default('development'),
    isCi: z.preprocess(coerceBoolean, z.boolean().default(false)),
    port: z.coerce.number().default(3000),

    auth: z.object({
      accessTokenSecret: z.string(),
      accessTokenExpiresIn: z.string().default(isTest ? '1m' : '10m'),
      refreshTokenSecret: z.string(),
      refreshTokenExpiresIn: z.string().default(isTest ? '1m' : '1d'),
      passwordCost: z.coerce.number().default(isTest ? 6 : 12),
    }),

    database: z.object({
      connectionString: z.string().url(),
    }),
    allowedOrigins: z.array(z.string()),
  })
  .readonly()

const config = schema.parse({
  env: env.NODE_ENV,
  port: env.PORT,
  isCi: env.CI,

  auth: {
    accessTokenSecret: env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
    passwordCost: env.PASSWORD_COST,
  },

  database: {
    connectionString: env.DATABASE_URL,
  },
  allowedOrigins: isProd
    ? [
        'https://flashwords-container.h4b71er768rva.ap-northeast-2.cs.amazonlightsail.com',
      ]
    : [
        'http://localhost:5173', // vite local
        'http://localhost:3000', // dev server local
        'http://localhost:4173', // vite preview
      ],
})

export default config

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (config.allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

// utility functions
function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }

  return undefined
}
