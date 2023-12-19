import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';
import { Linking } from 'react-native';

import { translate } from '../../../i18n';
import { Log } from '../../../screens/welcome/utils/utils';
import { RedirectionStatusUrls } from '../../../services/api';
import { CalendarApi } from '../../../services/api/calendar-api';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
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
            successUrl: 'bpartners://',
            failureUrl: 'bpartners://',
          },
        };
        const calendarConsentResult = yield calendarApi.initiateConsent(self.currentUser.id, payload);
        Linking.openURL(calendarConsentResult.redirectionUrl).catch(err => {
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
        Log(getCalendarResult);
      } catch (e) {
        Log('Failed to get calendars');
      }
    }),
  }));

export interface CalendarStore extends Instance<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotOut extends SnapshotOut<typeof CalendarStoreModel> {}

export interface CalendarStoreSnapshotIn extends SnapshotIn<typeof CalendarStoreModel> {}