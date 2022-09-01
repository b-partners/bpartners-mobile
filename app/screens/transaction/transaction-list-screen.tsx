import React, { FC, useEffect } from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import { GradientBackground, Header, Screen, Separator } from '../../components';
import { color, spacing } from '../../theme';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { palette } from '../../theme/palette';
import { Transaction } from './Transaction';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};
const FLAT_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: palette.white,
  margin: spacing[3],
};

export const TransactionListScreen: FC<StackScreenProps<NavigatorParamList, 'transactionList'>> = observer(({ navigation }) => {
  const goBack = () => navigation.goBack();

  const { transactionStore } = useStores();
  const { transactions } = transactionStore;

  useEffect(() => {
    async function fetchData() {
      await transactionStore.getTransactions();
    }

    fetchData();
  }, [transactionStore]);

  return (
    <View testID='TransactionListScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
        <Header headerTx='transactionListScreen.title' leftIcon='back' onLeftPress={goBack} style={HEADER} titleStyle={HEADER_TITLE} />
        <FlatList
          contentContainerStyle={FLAT_LIST}
          data={[...transactions]}
          renderItem={({ item }) => {
            return <Transaction item={item} />;
          }}
          ItemSeparatorComponent={() => <Separator />}
        />
      </Screen>
    </View>
  );
});
