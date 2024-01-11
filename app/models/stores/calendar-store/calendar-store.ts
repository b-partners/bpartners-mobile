import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { Log } from '../../../screens/welcome/utils/utils';
import { RedirectUrls, RedirectionStatusUrls } from '../../../services/api';
import { CalendarApi } from '../../../services/api/calendar-api';
import { CalendarModel } from '../../entities/calendar/calendar';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const CalendarStoreModel = types
  .model('Calendar')
  .props({
    calendars: types.maybeNull(types.array(CalendarModel)),
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
            successUrl: 'https://dashboard.preprod.bpartners.app/redirection',
            failureUrl: 'https://dashboard.preprod.bpartners.app/redirection',
          },
        };
        yield calendarApi.initiateConsent(self.currentUser.id, payload);
      } catch (e) {
        Log('Failed to init calendar consent');
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    initiateToken: flow(function* (code: string) {
      const calendarApi = new CalendarApi(self.environment.api);
      try {
        const redirectUrls: RedirectUrls = {
          redirectUrls: {
            successUrl: 'https://dashboard.preprod.bpartners.app/redirection',
            failureUrl: 'https://dashboard.preprod.bpartners.app/redirection',
          },
        };
        yield calendarApi.initiateToken(self.currentUser.id, code, redirectUrls);
      } catch (e) {
        Log('Failed to init calendar token');
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    getCalendars: flow(function* () {
      const calendarApi = new CalendarApi(self.environment.api);
      try {
        const getCalendarResult = yield calendarApi.getCalendars(self.currentUser.id);
        Log(getCalendarResult);
        return true;
      } catch (e) {
        Log('Failed to get calendars');
        return false;
      }
    }),
  }));

export interface CalendarStore extends Instance<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotOut extends SnapshotOut<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotIn extends SnapshotIn<typeof CalendarStoreModel> {}
