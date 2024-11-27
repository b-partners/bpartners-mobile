import { ProspectStatus } from '@bpartners/typescript-client';

import { GetListOptions } from '../queries';
import { storage } from '../utils/storage';
import { prospectingApi } from './api';

export type ProspectListParam = { name?: string; status?: ProspectStatus };

export const prospectProvider = {
  async getList({ filters, page, pageSize }: GetListOptions<ProspectListParam>) {
    const api = await prospectingApi();
    const accountHId = await storage.loadAccountHolderId();
    const { name, status } = filters || {};
    const { data } = await api.getProspects(accountHId, name, undefined, status, page, pageSize);
    return data || [];
  },
  async getOne(id: string) {
    const api = await prospectingApi();
    const accountHId = await storage.loadAccountHolderId();
    const { data } = await api.getProspectById(accountHId, id);
    return data || [];
  },
};
