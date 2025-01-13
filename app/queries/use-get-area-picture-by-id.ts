import { useQuery } from '@tanstack/react-query';

import { annotatorProvider } from '../provider';

export const useGetAreaPictureById = (areaPictureId: string) => {
  const { refetch, data, isLoading } = useQuery({
    enabled: !!areaPictureId,
    queryFn: () => annotatorProvider.getAreaPictureById(areaPictureId),
    queryKey: ['areaPicture', areaPictureId],
  });

  return {
    refetch,
    data,
    isLoading,
  };
};
