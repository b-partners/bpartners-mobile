import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Menu, Searchbar } from 'react-native-paper';

import { Header, Loader, MenuItem, NoDataProvided, Screen } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Prospect } from '../../models/entities/prospect/prospect';
import { TabNavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { ProspectItem } from './components/prospect-item';
import { prospectStyles as styles } from './utils/styles';

export const ProspectScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const { authStore, prospectStore } = useStores();
  const { prospects, loadingProspect } = prospectStore;

  const [currentStatus, setCurrentStatus] = useState<string>('TO_CONTACT');
  const [searchQuery, setSearchQuery] = React.useState('');

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

  const handleRefresh = async () => {
    await prospectStore.getProspects();
  };

  useEffect(() => {
    (async () => {
      await handleRefresh();
    })();
  }, []);
  const onChangeSearch = query => setSearchQuery(query);
  // const debounceTimeoutRef = useRef(null);

  const handleInputChange = query => {
    onChangeSearch(query);
    /*if (query) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        // await searchCustomer();
      }, 1000);
    }*/
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} style={HEADER} titleStyle={HEADER_TITLE} />
      <View testID='marketplaceScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        <Searchbar
          placeholder={translate('common.search')}
          onChangeText={handleInputChange}
          value={searchQuery}
          style={{
            backgroundColor: palette.solidGrey,
            height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing[4],
            width: '90%',
            marginHorizontal: '5%',
          }}
          iconColor={palette.lightGrey}
          clearIcon='close-circle'
          onClearIconPress={handleRefresh}
          inputStyle={{ color: palette.black, alignSelf: 'center' }}
          placeholderTextColor={palette.lightGrey}
        />
        <View style={styles.menuContainer}>
          <Menu.Item
            onPress={() => handleClickMenu('TO_CONTACT')}
            title='À Contacter'
            titleStyle={{ color: palette.secondaryColor }}
            style={{ ...getActiveClassName('TO_CONTACT'), width: '28%' }}
          />
          <Menu.Item
            onPress={() => handleClickMenu('CONTACTED')}
            title='Contacté'
            titleStyle={{ color: palette.secondaryColor }}
            style={{ ...getActiveClassName('CONTACTED'), width: '28%' }}
          />
          <Menu.Item
            onPress={() => handleClickMenu('CONVERTED')}
            title='Converti'
            titleStyle={{ color: palette.secondaryColor }}
            style={{ ...getActiveClassName('CONVERTED'), width: '28%' }}
          />
        </View>
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
          {loadingProspect ? (
            <View style={styles.loader}>
              <Loader size='large' style={styles.full} />
            </View>
          ) : filteredProspect.length > 0 ? (
            filteredProspect.map((item: Prospect, index: number) => {
              return <ProspectItem menuItem={items} prospect={item} ahId={currentAccountHolderId} setCurrentStatus={setCurrentStatus} key={index} />;
            })
          ) : (
            <NoDataProvided />
          )}
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
});
