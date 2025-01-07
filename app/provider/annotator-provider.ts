import { AreaPictureAnnotation, CrupdateAreaPictureDetails } from '@bpartners/typescript-client';
import axios from 'axios';

import { ConverterPayloadGeoJSON, ConverterResultGeoJSON } from '../screens/annotator-edition/utils';
import { storage } from '../utils/storage';
import { areaPictureApi } from './api';

export const annotatorProvider = {
  async getPictureFormAddress(pictureId: string, crupdateAreaPictureDetails: CrupdateAreaPictureDetails) {
    const api = await areaPictureApi();
    const accountId = await storage.loadAccountId();
    const { data } = await api.crupdateAreaPictureDetails(accountId, pictureId, {
      shiftNb: 0,
      ...crupdateAreaPictureDetails,
    } as any);
    return data;
  },
  async getAreaPictureById(pictureId: string) {
    const api = await areaPictureApi();
    const accountId = await storage.loadAccountId();
    const { data } = await api.getAreaPictureById(accountId, pictureId);
    return data;
  },
  async annotatePicture(pictureId: string, annotationId: string, newDataMapped: AreaPictureAnnotation) {
    const api = await areaPictureApi();
    const accountId = await storage.loadAccountId();
    const { data } = await api.annotateAreaPicture(accountId, pictureId, annotationId, newDataMapped);
    return data;
  },
  async getAnnotationPicture(pictureId: string, annotationId: string) {
    const api = await areaPictureApi();
    const accountId = await storage.loadAccountId();
    const { data } = await api.getAreaPictureAnnotation(accountId, pictureId, annotationId);
    return data;
  },
  async getAnnotationsPicture(pictureId: string) {
    const api = await areaPictureApi();
    const accountId = await storage.loadAccountId();
    const { data } = await api.getAreaPictureAnnotations(accountId, pictureId);
    return data;
  },
  async coordinatesToPixel(geojson: ConverterPayloadGeoJSON): Promise<ConverterResultGeoJSON[]> {
    const { data } = await axios.post(`${process.env.REACT_APP_ANNOTATOR_PIXEL_CONVERTER_API_URL}/converter`, geojson);
    return data;
  },
};
