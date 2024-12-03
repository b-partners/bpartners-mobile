import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { FC, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Dimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-paper';

import { Header, Text } from '../../components';
import { BpInput } from '../../components/bp-input';
import { TabNavigatorParamList } from '../../navigators/utils';
import { updateProspectDefaultValues, useCrupdateProspect } from '../../queries';
import { palette } from '../../theme/palette';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { ProspectCreationStyle } from './components/style';

export const ProspectFormScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospectForm'>> = ({ navigation, route }) => {
  const { prospect } = route.params ?? {};
  const { form, crupdate, isLoading } = useCrupdateProspect();
  const { width } = Dimensions.get('screen');
  const backHandler = () => navigation.navigate('home', { screen: 'prospect' });

  useEffect(() => {
    const currentProspect = prospect || updateProspectDefaultValues;
    Object.keys(currentProspect).forEach(key => {
      form.setValue(key as keyof typeof currentProspect, currentProspect[key]);
    });
  }, [prospect]);

  return (
    <KeyboardAwareScrollView>
      <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={backHandler} style={HEADER} titleStyle={HEADER_TITLE} />
      <View style={{ padding: 10, width }}>
        <View style={ProspectCreationStyle.headerContainer}>
          <Text text='Prospect : ' style={ProspectCreationStyle.headerTitle} />
        </View>
        <FormProvider {...form}>
          <BpInput name='address' labelTx='prospectScreen.process.address' />
          <BpInput name='name' labelTx='prospectScreen.process.name' />
          <BpInput name='firstName' labelTx='prospectScreen.process.firstName' />
          <BpInput name='email' labelTx='prospectScreen.process.email' />
          <BpInput name='phone' labelTx='prospectScreen.process.phone' />
          <BpInput multiline name='comment' labelTx='prospectScreen.process.comment' />
        </FormProvider>
        <View style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button loading={isLoading} onPress={crupdate} textColor={palette.white} style={{ backgroundColor: palette.secondaryColor }}>
            Enregistrer
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
