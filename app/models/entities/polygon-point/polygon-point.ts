import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const PolygonPointModel = types.model('PolygonPoint').props({
  x: types.maybeNull(types.number),
  y: types.maybeNull(types.number),
});

export interface PolygonPoint extends Instance<typeof PolygonPointModel> {}

export interface PolygonPointSnapshotOut extends SnapshotOut<typeof PolygonPointModel> {}

export interface PolygonPointSnapshotIn extends SnapshotIn<typeof PolygonPointModel> {}
