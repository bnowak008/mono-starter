import { UserTable, UserRelations } from './user';
import { SessionTable, SessionRelations } from './session';
import { AuthMethodTable, AuthMethodRelations } from './authMethod';

export * from './authMethod';
export * from './session';
export * from './user';
export const schema = {
  authMethod: AuthMethodTable,
  session: SessionTable,
  user: UserTable,
};

export const relations = {
  session: SessionRelations,
  user: UserRelations,
  authMethod: AuthMethodRelations,
};
