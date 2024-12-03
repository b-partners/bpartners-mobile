import { AreaPictureDetails, Prospect, ZoomLevel } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuid } from 'react-native-uuid/dist/v4';

import { annotatorProvider } from '../provider';
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
  console.log(data);
  return data;
};

interface UseCreateAreaPictureParams {
  onSuccess?: (data: AreaPictureDetails) => void;
}

export const useCreateAreaPicture = (params?: UseCreateAreaPictureParams) => {
  const { onSuccess } = params || {};
  const {
    data: areaPicture,
    isPending: isLoading,
    mutate: createAreaPicture,
    ...query
  } = useMutation({ mutationFn, mutationKey: ['create', 'area-picture'], onSuccess: savedAreaPicture => onSuccess(savedAreaPicture) });
  return {
    createAreaPicture,
    areaPicture,
    isLoading,
    query,
  };
};
