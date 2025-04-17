import { AreaPictureDetails, CrupdateAreaPictureDetails, FileType, Prospect, ZoomLevel } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';
import uuid from 'react-native-uuid';

import { annotatorProvider } from '../provider';
import { getFileUrl } from '../utils/file-utils';
import { notify } from '../utils/snackbar';
import { storage } from '../utils/storage';

interface MutationFnParams {
  pictureId: string;
  crupdateAreaPictureDetails: CrupdateAreaPictureDetails;
}

const mutationFn = async ({ crupdateAreaPictureDetails, pictureId }: MutationFnParams) => {
  const accountHolder = await storage.loadAccountHolder();
  const isRoofer = accountHolder?.businessActivities?.primary === 'Couvreur' || accountHolder?.businessActivities?.secondary === 'Couvreur';
  if (!isRoofer) {
    return null;
  }
  const areaPictureDetails = await annotatorProvider.getPictureFormAddress(pictureId, crupdateAreaPictureDetails);
  const pictureUrl = await getFileUrl(areaPictureDetails.fileId, FileType.AREA_PICTURE);
  return { areaPictureDetails, pictureUrl };
};

export interface UseCreateAreaPictureParams {
  onSuccess?: (data: AreaPictureDetails, pictureUrl: string) => void;
  defaultValues?: {
    pictureUrl?: string;
    areaPictureDetails?: AreaPictureDetails;
  };
}

const onError = (error: any) => {
  console.log(error);
  notify("L'adresse que vous avez spécifiée n'est pas encore pris en charge. Veuillez réessayer ultérieurement.", 'error');
};

export const useCreateAreaPicture = (params?: UseCreateAreaPictureParams) => {
  const { onSuccess, defaultValues } = params || {};
  const {
    data: areaPicture = defaultValues,
    isPending: isLoading,
    mutate,
    ...query
  } = useMutation({
    mutationFn,
    mutationKey: ['create', 'area-picture'],
    onSuccess: ({ areaPictureDetails, pictureUrl }) => onSuccess && onSuccess(areaPictureDetails, pictureUrl),
    onError,
  });

  const createFn = async (prospect: Prospect) => {
    const { id: prospectId, address } = prospect;
    const pictureId = uuid.v4();
    const fileId = uuid.v4();
    const filename = `Layer ${address}`;
    const zoomLevel = ZoomLevel.HOUSES_0;
    mutate({ pictureId, crupdateAreaPictureDetails: { prospectId, fileId, address, filename, zoomLevel } });
  };

  return {
    createAreaPicture: createFn,
    updateAreaPicture: mutate,
    areaPictureDetails: areaPicture?.areaPictureDetails,
    pictureUrl: areaPicture?.pictureUrl,
    isLoading,
    query,
  };
};
