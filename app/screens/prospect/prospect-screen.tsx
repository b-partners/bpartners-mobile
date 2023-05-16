import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, {FC, useCallback, useEffect, useState} from 'react';
import { ScrollView, View } from 'react-native';
import { Menu } from 'react-native-paper';

import {Header, Loader, Screen} from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { NoDataProvided } from '../../components/no-data-provided/no-data-provided';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Prospect } from '../../models/entities/prospect/prospect';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { ProspectItem } from './components/prospect-item';
import {LOADER_STYLE} from "../invoice-quotation/styles";

export const ProspectScreen: FC<DrawerScreenProps<NavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const { authStore, prospectStore } = useStores();
  const { prospects, loadingProspect } = prospectStore;

  const [currentStatus, setCurrentStatus] = useState<string>('TO_CONTACT');

  const currentAccountHolderId: string = authStore.currentAccountHolder?.id;

  const getActiveClassName = useCallback(
    (activeStatus): object => {
      return currentStatus === activeStatus && { borderBottomWidth: 2, borderColor: '#9C255A' };
    },
    [currentStatus]
  );

  const handleClickMenu = actualStatus => {
    setCurrentStatus(actualStatus);
  };

  const filteredProspect = prospects.filter(item => item.status === currentStatus);

  const items: MenuItem[] = [
    { id: 'toContact', title: translate('prospectScreen.tab.toContact') },
    { id: 'contacted', title: translate('prospectScreen.tab.contacted') },
    { id: 'converted', title: translate('prospectScreen.tab.converted') },
  ];

    useEffect(() => {
        prospectStore.getProspects();
    }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Screen preset='scroll' backgroundColor={palette.white} style={{ height: '100%' }}>
          <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          <View
            style={{
              width: '100%',
              height: '10%',
              marginVertical: spacing[1],
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <Menu.Item
              onPress={() => handleClickMenu('TO_CONTACT')}
              title='À Contacter'
              titleStyle={{ color: color.palette.secondaryColor }}
              style={{ ...getActiveClassName('TO_CONTACT'), width: '28%' }}
            />
            <Menu.Item
              onPress={() => handleClickMenu('CONTACTED')}
              title='Contacté'
              titleStyle={{ color: color.palette.secondaryColor }}
              style={{ ...getActiveClassName('CONTACTED'), width: '28%' }}
            />
            <Menu.Item
              onPress={() => handleClickMenu('CONVERTED')}
              title='Converti'
              titleStyle={{ color: color.palette.secondaryColor }}
              style={{ ...getActiveClassName('CONVERTED'), width: '28%' }}
            />
          </View>
          <ScrollView
            style={{
              width: '95%',
              height: '74%',
              borderWidth: 2,
              borderColor: '#F9F9FB',
              backgroundColor: '#F9F9FB',
              borderRadius: 10,
              alignSelf: 'center',
            }}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            { loadingProspect ?
                <Loader size='large' containerStyle={LOADER_STYLE} />
                : filteredProspect.length > 0 ? (
              filteredProspect.map((item: Prospect, index: number) => {
                return <ProspectItem menuItem={items} prospect={item} ahId={currentAccountHolderId} setCurrentStatus={setCurrentStatus} key={index} />;
              })
            ) : (
              <NoDataProvided />
            )}
          </ScrollView>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
