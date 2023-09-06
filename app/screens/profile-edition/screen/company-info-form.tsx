import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View } from 'react-native';

import { Text } from '../../../components';
import { TEXT_STYLE } from '../../../components/bp-drawer/utils/styles';
import { NavigatorParamList } from '../../../navigators';

export const CompanyInfoForm: FC<MaterialTopTabScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function InvoicesScreen({ navigation }) {
  return (
    <View>
      <Text style={TEXT_STYLE} text={'Company Info'} />
    </View>
  );
});
