import { initTRPC } from '@trpc/server'
import { getCookie } from 'hono/cookie'
import superjson from 'superjson'

import type { ApiContextProps } from '../context'

export const t = initTRPC.context<ApiContextProps>().create({
  transformer: superjson,
})

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const cookie = getCookie(ctx.c, ctx?.auth.sessionCookieName);
  const sessionId = ctx?.req?.header('Authorization')?.split(' ')[1] || cookie;

  if (sessionId) {
    const authResult = await ctx.auth.validateSession(sessionId)

    if (authResult.session) {
      ctx.user = authResult.user
      return next({
        ctx: {
          ...ctx,
          user: authResult.user,
          session: authResult.session
        }
      })
    }
  }
  
  return next({ ctx })
})

export const router = t.router;
export const protectedProcedure = t.procedure.use(authMiddleware)
