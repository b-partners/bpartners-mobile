import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { authProvider } from '../provider';

export const useGetWhoami = (onAuthError: () => void) => {
  const { data: whoami, error, isPending, isFetching } = useQuery({ queryFn: authProvider.getWhoami, queryKey: ['whoami'] });

  useEffect(() => {
    if (error) {
      onAuthError();
    }
  }, [error, whoami, isFetching, isPending]);

  return { whoami, error, isLoading: isPending || isFetching };
};
