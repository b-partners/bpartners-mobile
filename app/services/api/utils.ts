import { ApiResponse } from 'apisauce';

import { getGeneralApiProblem } from './api-problem';

export const getParams = (key: string, value: any) => {
  if (!value) return '';
  return `${key}=${value}`;
};

export type TPaginationFetcher = (page: number) => Promise<ApiResponse<any[]>>;

export const getPagination = async (fetcher: TPaginationFetcher, currentPage: number) => {
  let hasNext = false;
  const nextPage = currentPage + 1;
  const nextResult = await fetcher(nextPage);
  const currentResult = await fetcher(currentPage);

  if (!currentResult.ok) {
    const problem = getGeneralApiProblem(currentResult);
    if (problem) {
      __DEV__ && console.tron.log(problem.kind);
      throw new Error(problem.kind);
    }
  }

  if (nextResult.ok && (nextResult.data || []).length > 0) {
    hasNext = true;
  }

  return {
    hasNext,
    data: currentResult.data,
    kind: 'ok' as const,
  };
};
