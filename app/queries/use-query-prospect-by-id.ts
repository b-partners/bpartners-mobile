import { useMutation } from '@tanstack/react-query';

import { prospectProvider } from '../provider';

export const useQueryProspectById = () => {
  const { data, isPending, mutate } = useMutation({ mutationFn: prospectProvider.getOne, mutationKey: ['prospect', 'queryOne'] });
  return {
    queryProspectById: mutate,
    prospect: data,
    isPending,
  };
};
