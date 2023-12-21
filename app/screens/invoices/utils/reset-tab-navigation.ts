import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';

import { TabNavigatorParamList } from '../../../navigators/utils/utils';

export const navigateToTab = (navigation: MaterialTopTabNavigationProp<TabNavigatorParamList, 'invoices', undefined>, tab: string) => {
  navigation.reset({
    index: 0,
    routes: [{ name: 'paymentList', params: { initialRoute: tab } }],
  });
};
