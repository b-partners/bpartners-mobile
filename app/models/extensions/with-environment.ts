import { Environment } from '../environment';
import { IStateTreeNode, getEnv } from 'mobx-state-tree';

/**
 * Adds a environment property to the node for accessing our
 * Environment in strongly typed.
 */
export const withEnvironment = (self: IStateTreeNode) => ({
  views: {
    /**
     * The environment.
     */
    get environment() {
      return getEnv<Environment>(self);
    },
  },
});
