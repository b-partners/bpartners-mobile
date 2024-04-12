import { IStateTreeNode, getEnv } from 'mobx-state-tree';

import { GeojsonEnvironment } from '../geojson-environment';

/**
 * Adds a environment property to the node for accessing our
 * Environment in strongly typed.
 */
export const withGeojsonEnvironment = (self: IStateTreeNode) => ({
  views: {
    /**
     * The environment.
     */
    get environment() {
      return getEnv<GeojsonEnvironment>(self);
    },
  },
});
