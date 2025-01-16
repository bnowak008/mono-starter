import { router } from '../lib/trpc'
import { authRouter } from './auth'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  auth: authRouter,
});

// Export the router type and procedure helpers
export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
