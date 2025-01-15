import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Menu, Provider, Searchbar } from 'react-native-paper';

import { Header, Loader, NoDataProvided } from '../../components';
import { Pagination } from '../../components/bp-pagination';
import { translate } from '../../i18n';
import { Prospect, ProspectStatus } from '../../models/entities/prospect/prospect';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { useQueryProspect } from '../../queries';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { CreationPortal } from './components/portal-creation';
import { ProspectItem } from './components/prospect-item';
import { prospectStyles as styles } from './utils/styles';

export const ProspectScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const {
    data: prospects,
    isLoading: loadingProspect,
    setPage,
    hasNext,
    page,
    setStatus: setCurrentStatus,
    setSearchQuery: onChangeSearch,
    searchQuery,
    status,
    query: { refetch: handleRefresh },
  } = useQueryProspect({ status: ProspectStatus.TO_CONTACT, name: '' });

  const getActiveClassName = useCallback(
    (activeStatus: any): object => {
      return status === activeStatus ? { borderBottomWidth: 2, borderColor: '#9C255A' } : {};
    },
    [status]
  );

  const handleClickMenu = (actualStatus: ProspectStatus) => {
    setCurrentStatus(actualStatus);
    setPage(1);
  };

  const filteredProspect = prospects;

  const PROSPECT_STATUS = [
    { id: 'toContact', title: translate('prospectScreen.tab.toContact'), label: ProspectStatus.TO_CONTACT },
    { id: 'contacted', title: translate('prospectScreen.tab.contacted'), label: ProspectStatus.CONTACTED },
    { id: 'converted', title: translate('prospectScreen.tab.converted'), label: ProspectStatus.CONVERTED },
    { id: 'draft', title: 'Avec brouillons', label: 'DRAFT' },
  ];

  const prospectWithoutCurrentStatus = PROSPECT_STATUS.filter(s => s.label !== status);

  const { width } = Dimensions.get('screen');

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
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={styles.searchbar}
              iconColor={palette.lightGrey}
              clearIcon='close-circle'
              onClearIconPress={() => handleRefresh()}
              inputStyle={{ color: palette.black, alignSelf: 'center' }}
              placeholderTextColor={palette.lightGrey}
            />
            <CreationPortal />
          </View>
          <ScrollView horizontal style={[{ width: width - 10 }, styles.menuScrollContainer]}>
            <View style={styles.menuContainer}>
              {PROSPECT_STATUS.map(s => {
                return (
                  <Menu.Item
                    onPress={() => handleClickMenu(s.label as any)}
                    key={s.id}
                    title={s.title}
                    titleStyle={{ color: palette.secondaryColor }}
                    style={{ ...getActiveClassName(s.label) }}
                  />
                );
              })}
            </View>
          </ScrollView>
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
