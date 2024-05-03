import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { AnnotationMetadataModel } from '../annotation-metadata/annotation-metadata';
import { PolygonModel } from '../polygon/polygon';

export const AnnotationModel = types.model('AnnotationPicture').props({
  id: types.maybeNull(types.string),
  areaPictureId: types.maybeNull(types.string),
  annotationId: types.maybeNull(types.string),
  userId: types.maybeNull(types.string),
  metadata: types.maybeNull(AnnotationMetadataModel),
  labelType: types.maybeNull(types.string),
  labelName: types.maybeNull(types.string),
  polygon: types.maybeNull(PolygonModel),
});

export interface Annotation extends Instance<typeof AnnotationModel> {}

export interface AnnotationSnapshotOut extends SnapshotOut<typeof AnnotationModel> {}

export interface AnnotationSnapshotIn extends SnapshotIn<typeof AnnotationModel> {}
