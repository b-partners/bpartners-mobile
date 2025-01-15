import { AreaPictureDetails, CrupdateAreaPictureDetails } from '@bpartners/typescript-client';

export const areaPictureMapper = {
  areaPicDetailsToCrupdate(areaPicDetails: AreaPictureDetails): CrupdateAreaPictureDetails {
    return {
      ...areaPicDetails,
    };
  },
};
