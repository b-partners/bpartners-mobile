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

export const GeojsonModel = types.model('Geojson').props({
  size: types.maybeNull(types.string),
  filename: types.maybeNull(types.string),
  regions: types.maybeNull(RegionModel),
});

export interface GeojsonShape extends Instance<typeof GeojsonModel> {}

export interface GeojsonSnapshotOut extends SnapshotOut<typeof GeojsonModel> {}

export interface GeojsonSnapshotIn extends SnapshotIn<typeof GeojsonModel> {}
