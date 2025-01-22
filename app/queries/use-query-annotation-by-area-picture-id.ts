import { useQuery } from '@tanstack/react-query';

import { annotatorProvider } from '../provider';

export const useQueryAnnotationByAreaPictureId = (areaPictureId: string) => {
  const { data, isLoading, refetch } = useQuery({
    enabled: !!areaPictureId,
    queryFn: async () => (await annotatorProvider.getAnnotationsPicture(areaPictureId))?.[0]?.annotations,
    queryKey: ['annotation', 'areaPictureId'],
  });

  return {
    annotations: data,
    isLoading,
    refetch,
  };
};
