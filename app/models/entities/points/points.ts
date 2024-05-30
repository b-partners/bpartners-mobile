import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ShapeAttributesModel = types.model('Shape').props({
  name: types.maybeNull(types.string),
  all_points_x: types.optional(types.array(types.number), []),
  all_points_y: types.optional(types.array(types.number), []),
});

export const RegionAttributesModel = types.model('RegionAttributes').props({
  label: types.maybeNull(types.string),
});

export const RegionModel = types.model('Region').props({
  id: types.maybeNull(types.string),
  shapes_attributes: types.maybeNull(ShapeAttributesModel),
});

export const Regions = types.map(RegionModel);

export const PointsModel = types.model('Points').props({
  image_size: types.maybeNull(types.string),
  filename: types.maybeNull(types.string),
  regions: types.maybeNull(Regions),
  regions_attributes: types.maybeNull(RegionAttributesModel),
});

export interface Regions extends Instance<typeof Regions> {}
export interface Points extends Instance<typeof PointsModel> {}

export interface PointsSnapshotOut extends SnapshotOut<typeof PointsModel> {}

export interface PointsSnapshotIn extends SnapshotIn<typeof PointsModel> {}
