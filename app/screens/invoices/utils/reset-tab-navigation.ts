import { TabNavigatorParamList } from '../../../navigators/utils/utils';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';

export const navigateToTab = (navigation: MaterialTopTabNavigationProp<TabNavigatorParamList, 'invoices', undefined>, tab: string) => {
  navigation.reset({
    index: 0,
    routes: [{ name: 'paymentList', params: { initialRoute: tab } }],
  });
};
