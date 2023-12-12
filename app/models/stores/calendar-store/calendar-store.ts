import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { Log } from '../../../screens/welcome/utils/utils';
import { InitiateConsentResult, RedirectionStatusUrls } from '../../../services/api';
import { CalendarApi } from '../../../services/api/calendar-api';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const CalendarStoreModel = types
  .model('Calendar')
  .props({
    redirectionUrl: types.maybeNull(types.string),
    successUrl: types.maybeNull(types.string),
    failureUrl: types.maybeNull(types.string),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    initiateConsent: flow(function* () {
      const calendarApi = new CalendarApi(self.environment.api);
      try {
        const payload: RedirectionStatusUrls = {
          redirectionStatusUrls: {
            successUrl: '',
            failureUrl: '',
          },
        };
        const calendarConsentResult: InitiateConsentResult = yield calendarApi.initiateConsent(self.currentUser.id, payload);
        if (calendarConsentResult.kind === 'ok') {
          self.redirectionUrl = calendarConsentResult.redirectionStatusUrls.redirectionUrl;
          self.successUrl = calendarConsentResult.redirectionStatusUrls.redirectionStatusUrls.successUrl;
          self.failureUrl = calendarConsentResult.redirectionStatusUrls.redirectionStatusUrls.failureUrl;
          Log('Calendar consent success');
        } else {
          Log('Failed to init calendar consent');
        }
      } catch (e) {
        __DEV__ && console.tron.log('Failed to init calendar consent');
        self.catchOrThrow(e);
      }
    }),
  }));

export interface CalendarStore extends Instance<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotOut extends SnapshotOut<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotIn extends SnapshotIn<typeof CalendarStoreModel> {}
