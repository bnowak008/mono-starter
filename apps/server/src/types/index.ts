import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server';
import type { AppRouter } from '../routes';

// Export the router type itself
export type { AppRouter };

// Infer input/output types
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
