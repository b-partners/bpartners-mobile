import { AreaPictureDetails, CrupdateAreaPictureDetails } from '@bpartners/typescript-client';

export const areaPictureMapper = {
  areaPicDetailsToCrupdate(areaPicDetails: AreaPictureDetails): CrupdateAreaPictureDetails {
    const { address, fileId, filename, isExtended, prospectId, actualLayer, shiftNb, zoomLevel, zoom } = areaPicDetails || {};
    return {
      address,
      fileId,
      filename,
      isExtended,
      prospectId,
      layerId: actualLayer.id,
      shiftNb,
      zoomLevel,
      zoom,
    };
  },
};
