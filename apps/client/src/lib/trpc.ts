import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@rup/server/src/routes';
import { inferRouterOutputs } from '@trpc/server';

// This is the base router type
export const trpc = createTRPCReact<AppRouter>();

// Export these types for use in components if needed
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ProposalType = RouterOutputs['proposal']['getProposal'];
