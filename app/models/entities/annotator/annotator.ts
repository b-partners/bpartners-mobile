import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ShapeAttributesModel = types.model('Shape').props({
  name: types.maybeNull(types.string),
  all_points_x: types.optional(types.array(types.number), []),
  all_points_y: types.optional(types.array(types.number), []),
});

export const RegionAttributesModel = types.model('RegionAttributes').props({
  label: types.maybeNull(types.string),
});

export const ShapeModel = types.model('Shape').props({
  shape_attributes: types.maybeNull(ShapeAttributesModel),
  region_attributes: types.maybeNull(RegionAttributesModel),
});

export const RegionModel = types.model('Region').props({
  '1': types.maybeNull(ShapeModel),
});

export const AnnotatorShapeModel = types.model('AnnotatorShape').props({
  size: types.maybeNull(types.string),
  filename: types.maybeNull(types.string),
  regions: types.maybeNull(RegionModel),
});

export interface AnnotatorShape extends Instance<typeof AnnotatorShapeModel> {}

export interface AnnotatorShapeSnapshotOut extends SnapshotOut<typeof AnnotatorShapeModel> {}

export interface AnnotatorShapeSnapshotIn extends SnapshotIn<typeof AnnotatorShapeModel> {}
