import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Menu, Provider, Searchbar } from 'react-native-paper';

import { Header, Loader, NoDataProvided } from '../../components';
import { Pagination } from '../../components/bp-pagination';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Prospect, ProspectStatus } from '../../models/entities/prospect/prospect';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { CreationPortal } from './components/portal-creation';
import { ProspectItem } from './components/prospect-item';
import { prospectStyles as styles } from './utils/styles';

export const ProspectScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const { prospectStore } = useStores();
  const { prospects, loadingProspect, hasNext } = prospectStore;

  const [{ page, status }, setFilters] = useState<{ status: ProspectStatus; page: number }>({ status: ProspectStatus.TO_CONTACT, page: 1 });

  const setCurrentStatus = (currentStatus: string) => setFilters(prev => ({ ...prev, status: ProspectStatus[currentStatus] }));
  const setPage = (currentPage: number) => setFilters(prev => ({ ...prev, page: currentPage }));

  const [searchQuery, setSearchQuery] = React.useState('');

  const getActiveClassName = useCallback(
    (activeStatus): object => {
      return status === activeStatus && { borderBottomWidth: 2, borderColor: '#9C255A' };
    },
    [status]
  );

  const handleClickMenu = actualStatus => {
    setCurrentStatus(actualStatus);
    setPage(1);
  };

  const filteredProspect = prospects;

  const PROSPECT_STATUS = [
    { id: 'toContact', title: translate('prospectScreen.tab.toContact'), label: ProspectStatus.TO_CONTACT },
    { id: 'contacted', title: translate('prospectScreen.tab.contacted'), label: ProspectStatus.CONTACTED },
    { id: 'converted', title: translate('prospectScreen.tab.converted'), label: ProspectStatus.CONVERTED },
  ];

  const prospectWithoutCurrentStatus = PROSPECT_STATUS.filter(s => s.label !== status);

  const handleRefresh = async () => await prospectStore.getProspects({ name: '', page, perPage: 10, status });

  useEffect(() => {
    handleRefresh();
  }, [page, status]);

  const onChangeSearch = (query: string) => setSearchQuery(query);
  const debounceTimeoutRef = useRef(null);

  const searchProspect = async () => {
    await prospectStore.getProspects({ name: searchQuery });
  };

  const handleInputChange = (query: string) => {
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
        <Header
          headerTx='prospectScreen.title'
          leftIcon={'back'}
          rightIcon={'settings'}
          onLeftPress={() => navigation.navigate('bp_home')}
          onRightPress={() => navigation.navigate('prospectConfiguration')}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
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
            {PROSPECT_STATUS.map(s => {
              return (
                <Menu.Item
                  onPress={() => handleClickMenu(s.label)}
                  key={s.id}
                  title={s.title}
                  titleStyle={{ color: palette.secondaryColor }}
                  style={{ ...getActiveClassName(s.label), width: '28%' }}
                />
              );
            })}
          </View>
          <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            {loadingProspect && (
              <View style={styles.loader}>
                <Loader size='large' style={styles.full} />
              </View>
            )}

            {!loadingProspect && filteredProspect.length > 0 && (
              <>
                {filteredProspect.map((item: Prospect) => (
                  <ProspectItem key={item.id} menuItem={prospectWithoutCurrentStatus} prospect={item} setCurrentStatus={setCurrentStatus} />
                ))}
                <Pagination page={page} changePage={setPage} hasNext={hasNext} />
              </>
            )}
            {!loadingProspect && filteredProspect.length === 0 && <NoDataProvided reload={handleRefresh} />}
          </ScrollView>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
