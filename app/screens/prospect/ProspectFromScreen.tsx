import { AreaPictureDetails, Prospect } from '@bpartners/typescript-client';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { FC, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Dimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Text } from 'react-native-paper';

import { Header } from '../../components';
import { BpInput } from '../../components/bp-input';
import { TabNavigatorParamList } from '../../navigators/utils';
import { updateProspectDefaultValues, useCreateAreaPicture, useCrupdateProspect, useGetAccountHolder } from '../../queries';
import { palette } from '../../theme/palette';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { ProspectCreationStyle } from './components/style';

const getButtonName = (isRoofer: boolean, isCreating: boolean) => {
  if (isRoofer && isCreating) return "Générer l'image";
  if (!isRoofer && isCreating) return 'Créé le prospect';
  return 'Modifier le prospect';
};

export const ProspectFormScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospectForm'>> = ({ navigation, route }) => {
  const { prospect } = route.params ?? {};
  const { accountHolder, isAccountHolderLoading } = useGetAccountHolder([prospect]);
  const onCreateAreaPictureSuccess = (areaPictureDetails: AreaPictureDetails, pictureUrl: string) =>
    navigation.navigate('annotatorEdition', { areaPictureDetails, pictureUrl });
  const backHandler = () => navigation.navigate('home', { screen: 'prospect' });
  const onCrupdateProspectSuccess = (data: Prospect) => {
    if (!prospect) {
      createAreaPicture({ ...data });
    } else {
      backHandler();
    }
  };

  const { createAreaPicture, isLoading: isCreateAreaPictureLoading } = useCreateAreaPicture({ onSuccess: onCreateAreaPictureSuccess });

  const { form, crupdate, isLoading } = useCrupdateProspect({ onSuccess: onCrupdateProspectSuccess });

  const { width } = Dimensions.get('screen');

  useEffect(() => {
    const currentProspect = prospect || updateProspectDefaultValues;
    Object.keys(currentProspect).forEach(key => {
      form.setValue(key as keyof typeof currentProspect, currentProspect[key]);
    });
  }, [prospect]);

  const isRoofer = accountHolder?.businessActivities?.primary === 'Couvreur' || accountHolder?.businessActivities?.secondary === 'Couvreur';

  return (
    <KeyboardAwareScrollView>
      <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={backHandler} style={HEADER} titleStyle={HEADER_TITLE} />
      <View style={{ padding: 10, width }}>
        <Text style={ProspectCreationStyle.headerTitle}>
          Renseignez l'adresse de votre prospect ou votre client et analysez les images haute résolution de sa toiture.
        </Text>
        <FormProvider {...form}>
          <BpInput name='address' labelTx='prospectScreen.process.address' />
          <BpInput name='name' labelTx='prospectScreen.process.name' />
          <BpInput name='firstName' labelTx='prospectScreen.process.firstName' />
          <BpInput name='email' labelTx='prospectScreen.process.email' />
          <BpInput name='phone' labelTx='prospectScreen.process.phone' />
          <BpInput multiline name='comment' labelTx='prospectScreen.process.comment' />
        </FormProvider>
        <View style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            loading={isLoading || isCreateAreaPictureLoading || isAccountHolderLoading}
            disabled={isLoading || isCreateAreaPictureLoading || isAccountHolderLoading}
            onPress={crupdate}
            textColor={palette.white}
            style={{ backgroundColor: palette.secondaryColor }}
          >
            {getButtonName(isRoofer, !prospect)}
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
