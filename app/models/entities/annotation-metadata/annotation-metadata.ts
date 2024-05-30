import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const AnnotationMetadataModel = types.model('AnnotationMetadata').props({
  area: types.maybeNull(types.number),
  slope: types.maybeNull(types.number),
  wearLevel: types.maybeNull(types.number),
  covering: types.maybeNull(types.string),
  fillColor: types.maybeNull(types.string),
  strokeColor: types.maybeNull(types.string),
  comment: types.maybeNull(types.string),
  obstacle: types.maybeNull(types.string),
});

export interface AnnotationMetadata extends Instance<typeof AnnotationMetadataModel> {}

export interface AnnotationMetadata extends SnapshotOut<typeof AnnotationMetadataModel> {}

export interface AnnotationMetadataSnapshotIn extends SnapshotIn<typeof AnnotationMetadataModel> {}
