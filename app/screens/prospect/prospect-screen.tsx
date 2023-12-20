import { Header, Loader, NoDataProvided } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Prospect } from '../../models/entities/prospect/prospect';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { CreationPortal } from './components/portal-creation';
import { ProspectItem } from './components/prospect-item';
import { prospectStyles as styles } from './utils/styles';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Menu, Provider, Searchbar } from 'react-native-paper';

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

  const PROSPECT_STATUS = [
    { id: 'toContact', title: translate('prospectScreen.tab.toContact'), label: 'TO_CONTACT' },
    { id: 'contacted', title: translate('prospectScreen.tab.contacted'), label: 'CONTACTED' },
    { id: 'converted', title: translate('prospectScreen.tab.converted'), label: 'CONVERTED' },
  ];

  const prospectWithoutCurrentStatus = PROSPECT_STATUS.filter(status => status.label !== currentStatus);

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
      }, 1500);
    }
  };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('bp_home')} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='ProspectScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
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
            <CreationPortal />
          </View>
          <View style={styles.menuContainer}>
            {PROSPECT_STATUS.map(status => {
              return (
                <Menu.Item
                  onPress={() => handleClickMenu(status.label)}
                  key={status.id}
                  title={status.title}
                  titleStyle={{ color: palette.secondaryColor }}
                  style={{ ...getActiveClassName(status.label), width: '28%' }}
                />
              );
            })}
          </View>
          <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            {loadingProspect ? (
              <View style={styles.loader}>
                <Loader size='large' style={styles.full} />
              </View>
            ) : filteredProspect.length > 0 ? (
              filteredProspect.map((item: Prospect, index: number) => {
                return <ProspectItem key={index} menuItem={prospectWithoutCurrentStatus} prospect={item} setCurrentStatus={setCurrentStatus} />;
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
