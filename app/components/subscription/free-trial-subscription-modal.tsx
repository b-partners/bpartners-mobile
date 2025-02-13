import { differenceInDays } from 'date-fns';
import React from 'react';
import { View } from 'react-native';

import { useSheetModal } from '../../hook';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';
import { formatDate } from '../../utils/format-date';
import { BpButton } from '../bp-button';
import { Text } from '../text/text';
import { SubscriptionModal } from './subscription-modal';

export const FreeTrialSubscriptionModal = () => {
  const { close: closeSheetModal, open: openSheetModal } = useSheetModal();
  const {
    authStore: { currentUser },
  } = useStores();

  const startDate = currentUser?.subscription?.start;
  const endDate = currentUser?.subscription?.end;
  const remainingDays = differenceInDays(new Date(endDate), new Date());

  const handleDoSubscription = () => {
    openSheetModal(<SubscriptionModal allowClose />);
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, color: palette.purple, marginBottom: 10 }}>
        Vous bénéficiez actuellement d'une période d'essai gratuite.
      </Text>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>Début de la période d'essai :</Text>
        <Text style={{ fontSize: 14, color: 'black' }}>{formatDate(startDate)}</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>Fin de la période d'essai :</Text>
        <Text style={{ fontSize: 14, color: 'black' }}>{formatDate(endDate)}</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>Nombre de jours restants :</Text>
        <Text style={{ fontSize: 14, color: 'black' }}>
          {remainingDays} jour{remainingDays > 1 ? 's' : ''}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: 'black', marginTop: 10, textAlign: 'justify' }}>
        Aucun prélèvement ne se fera avant la fin de votre période d’essai de 14 jours.
      </Text>
      <Text style={{ fontSize: 14, color: 'black', marginTop: 10 }}>
        Si vous avez la moindre question, appelez-nous au <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>06.68.62.48.36</Text> ou par mail à{' '}
        <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>contact@bpartners.app</Text>.
      </Text>
      <View style={{ marginVertical: 20, flexDirection: 'column', gap: 10 }}>
        <BpButton onPress={closeSheetModal} textColor={palette.purple} style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.purple }}>
          Plus tard
        </BpButton>
        <BpButton onPress={() => handleDoSubscription()}>M'abonner</BpButton>
      </View>
    </View>
  );
};
