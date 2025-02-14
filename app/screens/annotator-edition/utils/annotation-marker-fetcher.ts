import { AreaPictureDetails, Point } from '@bpartners/typescript-client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { annotatorProvider } from '../../../provider';
import { storage } from '../../../utils/storage';
import { IMAGE_MARGIN_HALF } from './annotation-size-handler';
import { GeojsonMapper, PolygonMapper } from './mappers';
import { ConverterPayloadGeoJSON } from './types';

const defaultImageShiftSize = 256;

const setMarkerOffset = async (areaPictureDetails: AreaPictureDetails, _currentImageRealSize: number, currentImageSize: number) => {
  const markerPosition = await storage.loadInitialMarker();
  const imageRealSize = await storage.loadInitialImageRealSize();
  const currentImageRealSize = imageRealSize * 3;
  const scale = currentImageSize / currentImageRealSize;
  const { x, y } = markerPosition || {};

  const offset = (currentImageRealSize - imageRealSize) / 2;

  const horizontalShift = (areaPictureDetails.shiftNb || 0) * defaultImageShiftSize;

  return {
    x: (x + offset - horizontalShift) * scale,
    y: (y + offset) * scale,
  };
};

export const useAnnotationMarkerFetcher = (areaPictureDetails: AreaPictureDetails, imageRealSize: number, imageSize: number) => {
  const { refetch, data } = useQuery({
    queryKey: ['annotation', 'marker'],
    queryFn: async () => {
      const {
        filename,
        xTile: x_tile,
        yTile: y_tile,
        zoom: { number: zoom },
      } = areaPictureDetails;

      if (areaPictureDetails.isExtended) {
        return setMarkerOffset(areaPictureDetails, imageRealSize, imageSize);
      }
      const geoJson: ConverterPayloadGeoJSON = PolygonMapper.toRest(areaPictureDetails.geoPositions, {
        filename,
        image_size: imageRealSize,
        x_tile,
        y_tile,
        zoom,
      });
      const markerPoint = ((await annotatorProvider.coordinatesToPixel(geoJson)) || [null])[0];
      const mappedPoint = GeojsonMapper.toMarker(markerPoint)[0];
      storage.saveInitialMarker(mappedPoint);
      storage.saveInitialImageSize(imageSize);
      storage.saveInitialImageRealSize(imageRealSize);
      return {
        x: 128 + IMAGE_MARGIN_HALF,
        y: 128 + IMAGE_MARGIN_HALF,
      };
    },
    enabled: !!areaPictureDetails,
  });

  useEffect(() => {
    refetch();
  }, [areaPictureDetails, imageRealSize, imageSize]);

  return {
    marker: (data as Point) || {},
  };
};
