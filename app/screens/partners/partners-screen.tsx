import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native';

import { Header, Screen } from '../../components';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { PartnersCard } from './components/partners-card';

const CONTAINER: ViewStyle = {
  backgroundColor: palette.white,
  height: '100%',
  width: '100%',
};
const HEADER: TextStyle = {};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const PartnersScreen: FC<DrawerScreenProps<NavigatorParamList, 'partners'>> = observer(({ navigation }) => {
  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='partnersScreen.title' style={HEADER} titleStyle={HEADER_TITLE} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
      <Screen style={CONTAINER} preset='auto'>
        <View style={{ height: '100%', width: '100%', alignItems: 'center', marginTop: spacing[8] }}>
          <ScrollView horizontal style={{ height: 400, width: '100%' }} contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
            <PartnersCard
              firstLabel={'partnersScreen.bank.labelOne'}
              secondLabel={'partnersScreen.bank.labelTwo'}
              firstText={'partnersScreen.bank.textOne'}
              secondText={'partnersScreen.bank.textTwo'}
              buttonText={'partnersScreen.bank.button'}
            />
            <PartnersCard
              firstLabel={'partnersScreen.insurance.labelOne'}
              secondLabel={'partnersScreen.insurance.labelTwo'}
              firstText={'partnersScreen.insurance.textOne'}
              secondText={'partnersScreen.insurance.textTwo'}
              buttonText={'partnersScreen.insurance.button'}
              isInsurance={true}
            />
          </ScrollView>
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
