import { UserSubscriptionStatus } from '@bpartners/typescript-client';
import { differenceInDays } from 'date-fns';
import { View } from 'react-native';

import { useSheetModal } from '../../hook';
import { useStores } from '../../models';
import { SubscriptionModal } from '../../screens/profile/components';
import { BpButton } from '../bp-button';
import { Text } from '../text/text';

export const FreeTrialBanner = () => {
  const {
    authStore: { currentUser },
  } = useStores();
  const { open } = useSheetModal();
  const handleDoSubscription = () => {
    open(<SubscriptionModal allowClose />);
  };

  const userSubscription = currentUser?.subscription;
  const userSubscriptionStatus = userSubscription?.status;
  if (userSubscriptionStatus !== UserSubscriptionStatus.FREE_TRIAL) {
    return null;
  }

  const remainingDays = differenceInDays(new Date(userSubscription?.end), new Date());

  return (
    <View
      style={{
        backgroundColor: '#f5f25dF0',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Text
        style={{
          color: '#f71b31',
          fontWeight: 'bold',
          fontSize: 14,
        }}
      >
        Il vous reste {remainingDays} jour{remainingDays > 1 ? 's' : ''} d'essai !
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <BpButton textColor='white' onPress={handleDoSubscription}>
          M'abonner
        </BpButton>
      </View>
    </View>
  );
};
