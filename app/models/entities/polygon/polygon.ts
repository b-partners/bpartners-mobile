import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { PolygonPointModel } from '../polygon-point/polygon-point';

export const PolygonModel = types.model('Polygon').props({
  points: types.maybeNull(types.array(PolygonPointModel)),
});

export interface Polygon extends Instance<typeof PolygonModel> {}

export interface PolygonSnapshotOut extends SnapshotOut<typeof PolygonModel> {}

export interface PolygonSnapshotIn extends SnapshotIn<typeof PolygonModel> {}
