import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export enum ZoomLevel {
  WORLD_0 = 'WORLD_0',
  WORLD_1 = 'WORLD_1',
  WORLD_2 = 'WORLD_2',
  CONTINENT_0 = 'CONTINENT_0',
  CONTINENT_1 = 'CONTINENT_1',
  COUNTRIES = 'COUNTRIES',
  COUNTRY = 'COUNTRY',
  STATES = 'STATES',
  COUNTIES_0 = 'COUNTIES_0',
  COUNTIES_1 = 'COUNTIES_1',
  COUNTY = 'COUNTY',
  METROPOLITAN_AREA = 'METROPOLITAN_AREA',
  CITIES = 'CITIES',
  CITY = 'CITY',
  TOWN = 'TOWN',
  NEIGHBORHOOD = 'NEIGHBORHOOD',
  STREETS = 'STREETS',
  CITY_BLOCK = 'CITY_BLOCK',
  BUILDINGS = 'BUILDINGS',
  HOUSES_0 = 'HOUSES_0',
  HOUSES_1 = 'HOUSES_1',
  HOUSES_2 = 'HOUSES_2',
  HOUSE_PROPERTY = 'HOUSE_PROPERTY',
}

export const AreaPictureModel = types.model('AreaPicture').props({
  id: types.maybeNull(types.string),
  xTile: types.maybeNull(types.number),
  yTile: types.maybeNull(types.number),
  availableLayers: types.maybeNull(types.array(types.string)),
  address: types.maybeNull(types.string),
  zoomLevel: types.maybeNull(types.enumeration(Object.values(ZoomLevel))),
  layer: types.maybeNull(types.string),
  fileId: types.maybeNull(types.string),
  filename: types.maybeNull(types.string),
  prospectId: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
});

export interface AreaPicture extends Instance<typeof AreaPictureModel> {}

export interface AreaPictureSnapshotOut extends SnapshotOut<typeof AreaPictureModel> {}

export interface AreaPictureSnapshotIn extends SnapshotIn<typeof AreaPictureModel> {}