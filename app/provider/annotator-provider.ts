import { AreaPictureAnnotation, CrupdateAreaPictureDetails, ExportAreaPictureAnnotation } from '@bpartners/typescript-client';
import axios from 'axios';

import { ConverterPayloadGeoJSON, ConverterResultGeoJSON } from '../screens/annotator-edition/utils';
import { saveFile } from '../utils';
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
    const { data } = await axios.post(`https://q1xs10we5d.execute-api.eu-west-3.amazonaws.com/Prod/converter`, geojson);
    return data;
  },
  async exportToPDF(exportAreaPictureAnnotation: ExportAreaPictureAnnotation) {
    const accessToken = await storage.loadAccessToken();
    const accountId = await storage.loadAccountId();

    const data = await fetch(`https://api.prod.bpartners.app/accounts/${accountId}/annotations/exports`, {
      method: 'POST',
      body: JSON.stringify(exportAreaPictureAnnotation),
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        accept: 'application/json, text/plain, */*',
      },
    });

    // const buffer = Buffer.from(await data.arrayBuffer());
    // console.log(buffer);

    saveFile(await data.arrayBuffer(), exportAreaPictureAnnotation.address);
  },
};
