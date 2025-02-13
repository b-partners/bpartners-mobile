import { useMutation } from '@tanstack/react-query';
import { View } from 'react-native';

import { useSheetModal } from '../../hook';
import { useStores } from '../../models';
import { userSubscriptionProvider } from '../../provider';
import { palette } from '../../theme/palette';
import { formatDate } from '../../utils/format-date';
import { notify } from '../../utils/snackbar';
import { BpButton } from '../bp-button';
import { Text } from '../text/text';

export const CancelSubscriptionModal = () => {
  const { close: closeSheetModal } = useSheetModal();
  const {
    authStore: { currentUser },
  } = useStores();
  const endDate = currentUser?.subscription?.end;
  const formatedEndDate = formatDate(endDate);

  const { isPending, mutate: cancelRenew } = useMutation({
    mutationKey: ['subscription', 'layout', 'account', 'cancel'],
    mutationFn: userSubscriptionProvider.cancelRenew,
    onSuccess: () => {
      closeSheetModal();
      notify(`Votre renouvellement automatique a été annulé avec succès ; vous conserverez l'accès jusqu'au ${formatedEndDate}`, 'success');
    },
  });

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <Text style={{ color: palette.purple, fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
        Confirmation de l'annulation du renouvellement automatique
      </Text>
      <Text style={{ color: 'black' }}>En confirmant l'annulation du renouvellement automatique de votre abonnement, voici ce qui se passera:</Text>
      <View style={{ marginTop: 10, display: 'flex', gap: 10, flexDirection: 'column', paddingStart: 15 }}>
        <Text style={{ color: 'black', textAlign: 'justify' }}>
          • Vous conserverez l'accès à toutes les fonctionnalités de votre abonnement jusqu'au{' '}
          <Text style={{ color: 'black', fontWeight: 'bold' }}>{formatedEndDate}</Text>
        </Text>
        <Text style={{ color: 'black', textAlign: 'justify' }}>
          • À la fin de cette période, votre abonnement ne sera pas renouvelé automatiquement et aucun paiement supplémentaire ne sera débité.
        </Text>
        <Text style={{ color: 'black', textAlign: 'justify' }}>• Vous perdrez alors l'accès aux fonctionnalités premium liées à cet abonnement.</Text>
      </View>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <BpButton
          loading={isPending}
          textColor={palette.purple}
          style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.purple }}
          onPress={() => cancelRenew()}
        >
          Confirmer
        </BpButton>
        <BpButton loading={isPending} onPress={closeSheetModal}>
          Annuler
        </BpButton>
      </View>
    </View>
  );
};
