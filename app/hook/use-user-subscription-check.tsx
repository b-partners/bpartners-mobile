import { UserSubscriptionStatus } from '@bpartners/typescript-client';
import React, { useEffect } from 'react';

import { FreeTrialSubscriptionModal, SubscriptionModal } from '../components/subscription';
import { useStores } from '../models';
import { useSheetModal } from './use-sheet-modal';

export const userUserSubscriptionCheck = () => {
  const { open: openSheetModal } = useSheetModal();
  const {
    authStore: { currentUser },
  } = useStores();
  const userSubscriptionStatus = currentUser?.subscription?.status;
  const isConnected = userSubscriptionStatus !== undefined && userSubscriptionStatus !== null;

  useEffect(() => {
    switch (userSubscriptionStatus) {
      case UserSubscriptionStatus.FREE_TRIAL:
        openSheetModal(<FreeTrialSubscriptionModal />);
        break;
      case UserSubscriptionStatus.EMPTY:
        openSheetModal(<SubscriptionModal />, { panClose: false });
        break;
      default:
        break;
    }
  }, [isConnected]);
};
