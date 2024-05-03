import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ShapeAttributesModel = types.model('Shape').props({
  name: types.maybeNull(types.string),
  all_points_x: types.optional(types.array(types.number), []),
  all_points_y: types.optional(types.array(types.number), []),
});

export const RegionAttributesModel = types.model('RegionAttributes').props({
  label: types.maybeNull(types.string),
});

export const ShapeObjectModel = types.model('Shape').props({
  shape_attributes: types.maybeNull(ShapeAttributesModel),
  region_attributes: types.maybeNull(RegionAttributesModel),
});

export const RegionModel = types.model('Region').props({
  '1': types.maybeNull(ShapeObjectModel),
});

export const PointsModel = types.model('Points').props({
  size: types.maybeNull(types.string),
  filename: types.maybeNull(types.string),
  regions: types.maybeNull(RegionModel),
});

export interface Points extends Instance<typeof PointsModel> {}

export interface PointsSnapshotOut extends SnapshotOut<typeof PointsModel> {}

export interface PointsSnapshotIn extends SnapshotIn<typeof PointsModel> {}
