import { AreaPictureDetails, Point } from '@bpartners/typescript-client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { annotatorProvider } from '../../../provider';
import { storage } from '../../../utils/storage';
import { GeojsonMapper, PolygonMapper } from './mappers';
import { ConverterPayloadGeoJSON } from './types';

const defaultImageShiftSize = 256;

const setMarkerOffset = async (areaPictureDetails: AreaPictureDetails, currentImageSize: number) => {
  const markerPosition = await storage.loadInitialMarker();
  const imageSize = await storage.loadInitialImageSize();
  const { x, y } = markerPosition || {};

  const offset = (currentImageSize - imageSize) / 2;
  const horizontalShift = (areaPictureDetails.shiftNb || 0) * defaultImageShiftSize;

  return {
    x: x + offset - horizontalShift,
    y: y + offset,
  };
};

export const useAnnotationMarkerFetcher = (areaPictureDetails: AreaPictureDetails, image_size: number) => {
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
        return setMarkerOffset(areaPictureDetails, image_size);
      }
      const geoJson: ConverterPayloadGeoJSON = PolygonMapper.toRest(areaPictureDetails.geoPositions, { filename, image_size, x_tile, y_tile, zoom });
      const markerPoint = ((await annotatorProvider.coordinatesToPixel(geoJson)) || [null])[0];
      const mappedPoint = GeojsonMapper.toMarker(markerPoint)[0];
      storage.saveInitialMarker(mappedPoint);
      storage.saveInitialImageSize(image_size);
      return {
        x: 128,
        y: 128,
      };
    },
    enabled: !!areaPictureDetails,
  });

  useEffect(() => {
    refetch();
  }, [areaPictureDetails]);

  return {
    marker: (data as Point) || {},
  };
};
