import { z } from 'zod';
import { protectedProcedure, t } from '../lib/trpc';
import { createUser, signInWithEmail } from '../auth/user';
import { TRPCError } from '@trpc/server';
import type { UserTable } from '../db/schema/user';

// Define a consistent auth response type
type AuthResponse = {
  user: {
    id: string;
    email: string;
  } | null;
  session: {
    id: string;
  } | null;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRouter = t.router({
  login: t.procedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }): Promise<AuthResponse> => {
      try {
        const result = await signInWithEmail(
          ctx,
          input.email,
          input.password,
          ctx.setCookie
        );

        if (!result.session || !result.user) {
          throw new TRPCError({ 
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials'
          });
        }

        return {
          user: {
            id: result.user.id,
            email: result.user.email,
          },
          session: {
            id: result.session.id,
          }
        };
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error instanceof Error ? error.message : 'Login failed'
        });
      }
    }),

  register: t.procedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }): Promise<AuthResponse> => {
      const user = await createUser(ctx, 'email', input.email, input.password, {
        email: input.email
      });
      
      const result = await signInWithEmail(ctx, input.email, input.password, ctx.setCookie);
      
      if (!result.session || !user) {
        return {
          user: null,
          session: null
        };
      }

      return {
        user: {
          id: user.id,
          email: user.email,
        },
        session: {
          id: result.session.id,
        }
      };
    }),

  me: protectedProcedure.query(({ ctx }): AuthResponse => {
    if (!ctx.user || !ctx.session) {
      return {
        user: null,
        session: null
      };
    }

    return {
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
      },
      session: {
        id: ctx.session.id,
      }
    };
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No active session',
      });
    }
    
    await ctx.auth.invalidateSession(ctx.session.id);
    ctx.setCookie(ctx.auth.createBlankSessionCookie().serialize());
    
    return {
      user: null,
      session: null
    };
  }),
}); 