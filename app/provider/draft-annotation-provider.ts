import { GetListOptions } from '../queries';
import { storage } from '../utils/storage';
import { areaPictureApi } from './api';

export type DraftAnnotationListParams = {};

export const draftAnnotationProvider = {
  async getList({ page, pageSize }: GetListOptions<DraftAnnotationListParams>) {
    const api = await areaPictureApi();
    const accountId = await storage.loadAccountId();
    try {
      const { data } = await api.getDraftAnnotationsByAccountId(accountId, page, pageSize);
      return data || [];
    } catch (err) {
      console.trace(err);
    }
  },
  async getOneByAReaPictureId(areaPictureId: string) {
    const api = await areaPictureApi();
    const accountId = await storage.loadAccountId();
    try {
      const { data } = await api.getDraftAnnotationsByAccountIdAndAreaPictureId(accountId, areaPictureId);
      return data || [];
    } catch (err) {
      console.trace(err);
    }
  },
};
