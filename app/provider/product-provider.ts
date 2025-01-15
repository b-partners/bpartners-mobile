import { OrderDirection, ProductStatus } from '@bpartners/typescript-client';

import { GetListOptions } from '../queries';
import { amountToMinors } from '../utils/money';
import { storage } from '../utils/storage';
import { payingApi } from './api';

export type ProductListParams = {
  descriptionFilter?: string;
  priceFilter?: number;
  sort?: {
    field?: string;
    order?: OrderDirection;
  };
};

export const productProvider = {
  async getList({ filters, page, pageSize }: GetListOptions<ProductListParams>) {
    const { descriptionFilter, priceFilter, sort } = filters || {};
    const { field, order } = sort || {};
    const api = await payingApi();
    const accountId = await storage.loadAccountId();

    const { data } = await api.getProducts(
      accountId,
      true,
      field === 'description' ? order : undefined,
      field === 'unitPrice' ? order : undefined,
      field === 'createdAt' ? order : undefined,
      descriptionFilter,
      priceFilter ? amountToMinors(+priceFilter) : undefined,
      ProductStatus.ENABLED,
      page,
      pageSize
    );

    return data;
  },
};
