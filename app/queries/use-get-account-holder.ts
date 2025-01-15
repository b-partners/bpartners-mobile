import { useQuery } from '@tanstack/react-query';

import { storage } from '../utils/storage';

export const useGetAccountHolder = (queryKey?: any[]) => {
  const { data, isLoading, ...others } = useQuery({ queryKey: ['accountHolder', ...(queryKey || [])], queryFn: storage.loadAccountHolder });
  return { ...others, accountHolder: data, isAccountHolderLoading: isLoading };
};
