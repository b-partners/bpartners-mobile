import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const GeometryModel = types.model('Geometry').props({
  type: types.maybeNull(types.string),
  coordinates: types.maybeNull(types.array(types.array(types.array(types.array(types.number))))),
});

export const PropertiesModel = types.model('Properties').props({
  id: types.maybeNull(types.string),
});

export const GeojsonModel = types.model('Geojson').props({
  properties: types.maybeNull(PropertiesModel),
  type: types.maybeNull(types.string),
  geometry: types.maybeNull(GeometryModel),
});

export interface Geojson extends Instance<typeof GeojsonModel> {}

export interface GeojsonSnapshotOut extends SnapshotOut<typeof GeojsonModel> {}

export interface GeojsonSnapshotIn extends SnapshotIn<typeof GeojsonModel> {}
