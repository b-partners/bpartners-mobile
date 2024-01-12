import { translate } from 'i18n-js';
import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';
import { Linking } from 'react-native';

import { Log } from '../../../screens/welcome/utils/utils';
import { RedirectUrls, RedirectionStatusUrls } from '../../../services/api';
import { CalendarApi } from '../../../services/api/calendar-api';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { SummaryModel } from '../../entities/calendar/calendar';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const CalendarStoreModel = types
  .model('Calendar')
  .props({
    summary: types.optional(types.array(SummaryModel), []),
    currentSummary: types.maybeNull(SummaryModel),
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
        const calendarConsentResult = yield calendarApi.initiateConsent(self.currentUser.id, payload);
        Linking.openURL(calendarConsentResult.redirectionUrl)
          .then(() => {
            Linking.addEventListener('url', async ({ url }) => {
              const params = new URLSearchParams(url.split('?')[1]);
              const code = params.get('code');
              Log('Deep link param:' + code);
              const redirectUrls: RedirectUrls = {
                successUrl: 'https://dashboard.preprod.bpartners.app/redirection',
                failureUrl: 'https://dashboard.preprod.bpartners.app/redirection',
              };
              await calendarApi.initiateToken(self.currentUser.id, code, redirectUrls);
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
    initiateToken: flow(function* (code: string) {
      const calendarApi = new CalendarApi(self.environment.api);
      try {
        const redirectUrls: RedirectUrls = {
          successUrl: 'https://dashboard.preprod.bpartners.app/redirection',
          failureUrl: 'https://dashboard.preprod.bpartners.app/redirection',
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
        const getSummaryResult = yield calendarApi.getSummary(self.currentUser.id);
        self.summary.replace(getSummaryResult.summary);
        self.currentSummary = getSummaryResult.summary[0];
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
