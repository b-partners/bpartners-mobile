import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

/**
 * Model description here for TypeScript hints.
 */
export const AuthUserModel = types.model('AuthUser').props({
  // username input
  userName: types.maybe(types.maybeNull(types.string)),
});

export interface AuthUser extends Instance<typeof AuthUserModel> {}

export interface AuthUserSnapshotOut extends SnapshotOut<typeof AuthUserModel> {}

export interface AuthUserSnapshotIn extends SnapshotIn<typeof AuthUserModel> {}

export const createAuthUserDefaultModel = () => types.optional(AuthUserModel, {});
