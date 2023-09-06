import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View } from 'react-native';

import { NavigatorParamList } from '../../../navigators';

export const ActivityForm: FC<MaterialTopTabScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function InvoicesScreen({ navigation }) {
  return (
    <View>
      <View></View>
    </View>
  );
});
