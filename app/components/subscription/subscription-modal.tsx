import { useMutation } from '@tanstack/react-query';
import React, { FC } from 'react';
import { Linking, View } from 'react-native';

import { useSheetModal } from '../../hook';
import { userSubscriptionProvider } from '../../provider';
import { palette } from '../../theme/palette';
import { BpButton } from '../bp-button';
import { Text } from '../text/text';

const mutationFn = async () => {
  const { redirectionUrl } = await userSubscriptionProvider.init();
  Linking.openURL(redirectionUrl);
  return redirectionUrl;
};

export type SubscriptionModalProps = {
  allowClose?: boolean;
};
export const SubscriptionModal: FC<SubscriptionModalProps> = ({ allowClose = false }) => {
  const { close: closeSheetModal } = useSheetModal();
  const { isPending, mutate } = useMutation({
    mutationKey: ['subscription', 'modal'],
    mutationFn,
  });

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: palette.purple, marginBottom: 10 }}>Finalisez votre inscription en toute sérénité !</Text>

      <Text style={{ color: 'black', textAlign: 'justify' }}>
        Vous n’avez pas encore d’abonnement actif. Pour continuer à utiliser l’application BIRDIA, veuillez enregistrer votre carte bancaire via notre
        partenaire sécurisé Stripe.
      </Text>
      <Text style={{ marginTop: 10, fontWeight: 'bold', color: 'black' }}>Pas d’inquiétude :</Text>
      <View style={{ marginTop: 5, paddingStart: 15 }}>
        <Text style={{ color: 'black' }}>• Vous pouvez arrêter votre abonnement à tout moment dans l’application.</Text>
      </View>

      <Text style={{ marginTop: 10, color: 'black' }}>
        Si vous avez la moindre question, n’hésitez pas à nous appeler au <Text style={{ color: palette.purple, fontWeight: 'bold' }}>06.68.62.48.36</Text> ou
        par mail à <Text style={{ color: palette.purple, fontWeight: 'bold' }}>contact@bpartners.app</Text>
      </Text>

      <View style={{ marginTop: 20, flexDirection: 'column', gap: 10 }}>
        {allowClose && (
          <BpButton
            textColor={palette.purple}
            style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.purple }}
            onPress={closeSheetModal}
          >
            Plus tard
          </BpButton>
        )}
        <BpButton loading={isPending} onPress={() => mutate()}>
          S'abonner
        </BpButton>
      </View>
    </View>
  );
};
