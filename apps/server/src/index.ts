import { type Env, Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import { cors } from 'hono/cors'
import { appRouter } from './routes'
import { createContext } from './context'

export type Bindings = Env & {
  DB_URL: string
  JWT_VERIFICATION_KEY: string
  APP_URL: string
  // For auth
  APPLE_CLIENT_ID: string
  APPLE_TEAM_ID: string
  APPLE_KEY_ID: string
  APPLE_CERTIFICATE: string
  DISCORD_CLIENT_ID: string
  DISCORD_CLIENT_SECRET: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  RESEND_API_KEY: string
  PUBLIC_SUPPORT_EMAIL: string
  PUBLIC_API_URL: string
  PUBLIC_NATIVE_SCHEME: string
  OPENAI_API_KEY: string
  [k: string]: unknown
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-enable-tokens'],
  exposeHeaders: ['Set-Cookie'],
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: async (opts, c) => {
      const context = await createContext({
          ...c.env,
          DB_URL: process.env.DB_URL || c.env.DB_URL,
          APP_URL: process.env.APP_URL || c.env.APP_URL,
        }, c)
              
      return context as unknown as Record<string, unknown>
    },
  })
)

export default app
