import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Menu, Provider, Searchbar } from 'react-native-paper';

import { Header, Loader, MenuItem, NoDataProvided } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Prospect } from '../../models/entities/prospect/prospect';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { ProspectItem } from './components/prospect-item';
import { prospectStyles as styles } from './utils/styles';

export const ProspectScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const { prospectStore } = useStores();
  const { prospects, loadingProspect } = prospectStore;

  const [currentStatus, setCurrentStatus] = useState<string>('TO_CONTACT');
  const [searchQuery, setSearchQuery] = React.useState('');

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
  const debounceTimeoutRef = useRef(null);

  const searchProspect = async () => {
    await prospectStore.getProspects({ name: searchQuery });
  };

  const handleInputChange = query => {
    onChangeSearch(query);
    if (query) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        await searchProspect();
      }, 1000);
    }
  };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('bp_home')} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='ProspectScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
          <Searchbar
            placeholder={translate('common.search')}
            onChangeText={handleInputChange}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={palette.lightGrey}
            clearIcon='close-circle'
            onClearIconPress={handleRefresh}
            inputStyle={{ color: palette.black, alignSelf: 'center' }}
            placeholderTextColor={palette.lightGrey}
          />
          <View style={styles.menuContainer}>
            <Menu.Item
              onPress={() => handleClickMenu('TO_CONTACT')}
              title={translate('prospectScreen.tab.toContact')}
              titleStyle={{ color: palette.secondaryColor }}
              style={{ ...getActiveClassName('TO_CONTACT'), width: '28%' }}
            />
            <Menu.Item
              onPress={() => handleClickMenu('CONTACTED')}
              title={translate('prospectScreen.tab.contacted')}
              titleStyle={{ color: palette.secondaryColor }}
              style={{ ...getActiveClassName('CONTACTED'), width: '28%' }}
            />
            <Menu.Item
              onPress={() => handleClickMenu('CONVERTED')}
              title={translate('prospectScreen.tab.converted')}
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
                return <ProspectItem menuItem={items} prospect={item} setCurrentStatus={setCurrentStatus} key={index} />;
              })
            ) : (
              <NoDataProvided />
            )}
          </ScrollView>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
