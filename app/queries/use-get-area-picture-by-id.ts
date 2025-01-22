import { FileType } from '@bpartners/typescript-client';
import { useQuery } from '@tanstack/react-query';

import { annotatorProvider } from '../provider';
import { getFileUrl } from '../utils/file-utils';

export const useGetAreaPictureById = (areaPictureId: string) => {
  const { refetch, data, isLoading } = useQuery({
    enabled: !!areaPictureId,
    queryFn: async () => {
      const areaPictureDetails = await annotatorProvider.getAreaPictureById(areaPictureId);
      const pictureUrl = await getFileUrl(areaPictureDetails.fileId, FileType.AREA_PICTURE);
      return { areaPictureDetails, pictureUrl };
    },
    queryKey: ['areaPicture', areaPictureId],
  });

  return {
    refetch,
    data: data?.areaPictureDetails || {},
    pictureUrl: data?.pictureUrl || '',
    isLoading,
  };
};
