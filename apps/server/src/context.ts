import type { Session } from './auth/user'
import { retrieveDb } from './db'
import type { User } from './db/schema'
import type { Bindings } from '.'
import type { Context as HonoContext, HonoRequest } from 'hono'
import type { Lucia } from 'lucia'
import { verifyRequestOrigin } from 'oslo/request'
import { createAuth, getAllowedOriginHost } from './auth'
import { getCookie } from 'hono/cookie'

export interface ApiContextProps {
  session?: Session
  user?: User
  auth: Lucia
  req: HonoRequest
  c: HonoContext
  enableTokens: boolean
  setCookie: (value: string) => void
  db: ReturnType<typeof retrieveDb>
  env: Bindings
}

export const createContext: (
  env: Bindings,
  context: HonoContext,
  resHeaders?: Headers
) => Promise<ApiContextProps> = async (env, context, resHeaders) => {
  const dbUrl = context?.env.DB_URL || process.env.DB_URL || '';
  const db = retrieveDb(dbUrl);
  const auth = createAuth(db, context.env.APP_URL || process.env.APP_URL || '')
  const enableTokens = Boolean(context?.req.header('x-enable-tokens'))

  async function getSession() {
    let user: User | undefined
    let session: Session | undefined
    const res = {
      user,
      session,
    }

    if (!context?.req) return res

    const cookieSessionId = getCookie(context, auth.sessionCookieName)
    const bearerSessionId = enableTokens && context.req.header('authorization')?.split(' ')[1]
    
    if (!cookieSessionId && !bearerSessionId) return res

    let authResult: Awaited<ReturnType<typeof auth.validateSession>> | undefined
    if (cookieSessionId && !enableTokens) {
      const originHeader = context.req.header('origin')
      const hostHeader = context.req.header('host')

      if (!hostHeader) {
        throw new Error('Host header not found.')
      }

      const allowedOrigin = getAllowedOriginHost(process.env.APP_URL || '', context.req.raw)
      const allowedHosts = [
        hostHeader,
        hostHeader.replace('localhost', '127.0.0.1'),
        hostHeader.replace('127.0.0.1', 'localhost'),
        ...(allowedOrigin ? [allowedOrigin] : []),
        process.env.APP_URL?.replace('localhost', '127.0.0.1') ?? '',
        process.env.APP_URL?.replace('127.0.0.1', 'localhost') ?? '',
      ];

      if (originHeader && hostHeader && verifyRequestOrigin(originHeader, allowedHosts)) {
        authResult = await auth.validateSession(cookieSessionId)
        if (authResult.session?.fresh) {
          context.header(
            'Set-Cookie',
            auth.createSessionCookie(authResult.session.id).serialize(),
            {
              append: true,
            }
          )
        }
        if (!authResult?.session) {
          context.header('Set-Cookie', auth.createBlankSessionCookie().serialize(), {
            append: true,
          })
        }
      } else {
        console.error('CSRF failed', { cookieSessionId, originHeader, hostHeader, allowedOrigin })
      }
    }
    if (bearerSessionId) {
      authResult = await auth.validateSession(bearerSessionId)
    }
    res.session = authResult?.session || undefined
    res.user = authResult?.user || undefined
    
    return res
  }

  const { session, user } = await getSession()

  return {
    db,
    auth,
    req: context.req,
    c: context,
    session,
    user,
    enableTokens,
    setCookie: (value: string) => {
      context.header('Set-Cookie', value);
    },
    env,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
