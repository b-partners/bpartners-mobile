import { AreaPictureDetails, FileType, Prospect, ZoomLevel } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuid } from 'react-native-uuid/dist/v4';

import { annotatorProvider } from '../provider';
import { getFileUrl } from '../utils/file-utils';
import { storage } from '../utils/storage';

const mutationFn = async (prospect: Prospect) => {
  const accountHolder = await storage.loadAccountHolder();
  const isRoofer = accountHolder?.businessActivities?.primary === 'Couvreur' || accountHolder?.businessActivities?.secondary === 'Couvreur';
  if (!isRoofer) {
    return null;
  }
  const { id: prospectId, address } = prospect;
  const pictureId = uuid();
  const fileId = uuid();
  const filename = `Layer ${address}`;
  const zoomLevel = ZoomLevel.HOUSES_0;
  const data = await annotatorProvider.getPictureFormAddress(pictureId, { prospectId, fileId, address, filename, zoomLevel });
  const pictureUrl = await getFileUrl(data.fileId, FileType.AREA_PICTURE);
  return { data, pictureUrl };
};

interface UseCreateAreaPictureParams {
  onSuccess?: (data: AreaPictureDetails, pictureUrl: string) => void;
}

export const useCreateAreaPicture = (params?: UseCreateAreaPictureParams) => {
  const { onSuccess } = params || {};
  const {
    data: areaPicture,
    isPending: isLoading,
    mutate: createAreaPicture,
    ...query
  } = useMutation({ mutationFn, mutationKey: ['create', 'area-picture'], onSuccess: ({ data, pictureUrl }) => onSuccess(data, pictureUrl) });
  return {
    createAreaPicture,
    areaPicture,
    isLoading,
    query,
  };
};
