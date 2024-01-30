import { translate } from 'i18n-js';
import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';
import { Linking } from 'react-native';

import env from '../../../config/env';
import { navigate, navigationRef } from '../../../navigators/navigation-utilities';
import { Log } from '../../../screens/welcome/utils/utils';
import { RedirectUrls, RedirectionStatusUrls } from '../../../services/api';
import { CalendarApi } from '../../../services/api/calendar-api';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { Event } from '../../entities/calendar/calendar';
import { CalendarModel, EventModel } from '../../entities/calendar/calendar';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const CalendarStoreModel = types
  .model('Calendar')
  .props({
    calendars: types.optional(types.array(CalendarModel), []),
    currentCalendar: types.maybeNull(CalendarModel),
    events: types.optional(types.array(EventModel), []),
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
            successUrl: env.calendarRedirectionUrl,
            failureUrl: env.calendarRedirectionUrl,
          },
        };
        const calendarConsentResult = yield calendarApi.initiateConsent(self.currentUser.id, payload);
        Linking.openURL(calendarConsentResult.redirectionUrl)
          .then(() => {
            Linking.addEventListener('url', async ({ url }) => {
              const params = new URLSearchParams(url.split('?')[1]);
              const code = params.get('code');
              Log('Deep link param:' + code);
              const redirectUrls: RedirectUrls = {
                successUrl: env.calendarRedirectionUrl,
                failureUrl: env.calendarRedirectionUrl,
              };
              await calendarApi.initiateToken(self.currentUser.id, code, redirectUrls);
              navigate('welcome');
              navigationRef.current.reset({
                index: 0,
                routes: [{ name: 'calendar' }],
              });
              setTimeout(() => navigate('calendar'), 1000);
            });
          })
          .catch(err => {
            Log("Erreur lors de l'ouverture du lien :", err);
            showMessage(translate('errors.openBrowser'), { backgroundColor: palette.yellow });
          });
      } catch (e) {
        Log('Failed to init calendar consent');
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    getCalendars: flow(function* () {
      const calendarApi = new CalendarApi(self.environment.api);
      try {
        const getCalendarResult = yield calendarApi.getCalendars(self.currentUser.id);
        self.calendars.replace(getCalendarResult.calendar);
        self.currentCalendar = getCalendarResult.calendar[0];
        return true;
      } catch (e) {
        Log(e.message);
        return false;
      }
    }),
  }))
  .actions(self => ({
    getEvents: flow(function* (from: string, to: string) {
      const calendarApi = new CalendarApi(self.environment.api);
      try {
        const getCalendarsEventsResult = yield calendarApi.getCalendarsEvents(self.currentUser.id, self.currentCalendar.id, 'GOOGLE_CALENDAR', from, to);
        self.events.replace(getCalendarsEventsResult.events);
        return true;
      } catch (e) {
        Log(e.message);
        return false;
      }
    }),
  }))
  .actions(self => ({
    createOrUpdateEvents: flow(function* (event: Event) {
      const calendarApi = new CalendarApi(self.environment.api);
      try {
        const updateCalendarsEventsResult = yield calendarApi.createOrUpdateCalendarsEvent(self.currentUser.id, self.currentCalendar.id, event);
        self.events.replace(updateCalendarsEventsResult.events);
        return true;
      } catch (e) {
        Log(e.message);
        return false;
      }
    }),
  }));

export interface CalendarStore extends Instance<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotOut extends SnapshotOut<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotIn extends SnapshotIn<typeof CalendarStoreModel> {}
