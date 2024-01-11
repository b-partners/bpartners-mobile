import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-native-paper';

import {Header, Text} from '../../components';
import { NavigatorParamList } from '../../navigators/utils/utils';
import {color, spacing} from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import {palette} from "../../theme/palette";

export const ConfigurationScreen: FC<DrawerScreenProps<NavigatorParamList, 'configuration'>> = observer(function ConfigurationScreen({ navigation }) {

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='configurationScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='ConfigurationScreen' style={{ ...FULL, backgroundColor: color.palette.white, padding: spacing[3] }}>
            <Text tx={'configurationScreen.RelaunchFrequency'} style={{color: palette.black, fontSize: 18, marginBottom: spacing[5]}} />
            <Text tx={'configurationScreen.UnconfirmedQuotation'} style={{color: palette.black, fontSize: 16, marginBottom: spacing[3]}} />
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
