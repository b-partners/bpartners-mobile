import { DrawerScreenProps } from '@react-navigation/drawer';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { Notifications, Registered } from 'react-native-notifications';

import { HeaderWithBalance, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { createFileUrl } from '../../utils/file-utils';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/components/utils';
import { Log } from '../welcome/utils/utils';
import { HomeLatestTransactions } from './components/home-latest-transactions';
import { Logo } from './components/logo';
import { Menu } from './components/menu';
import { TransactionSummary } from './components/transaction-summary';
import { FULL } from './utils/styles';

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore, authStore } = useStores();
  const { availableBalance } = authStore.currentAccount;
  const { currentAccount, currentAccountHolder, currentUser, accessToken } = authStore;
  const { loadingTransactions, currentMonthSummary, latestTransactions, transactionsSummary } = transactionStore;

  const uri = createFileUrl(currentUser.logoFileId, currentAccount.id, accessToken, 'LOGO');

  const cognitoPool = 'eu-west-3_Fv8n7AfVo';
  const androidARN = 'arn:aws:sns:eu-west-3:688605879718:app/GCM/bpartners-notifications';

  useEffect(() => {
    (async () => {
      const date = new Date();
      await authStore.whoami(accessToken);
      await transactionStore.getTransactionCategories();
      await transactionStore.getTransactionsSummary(date.getFullYear());
      await transactionStore.getTransactions({ page: 1, pageSize: invoicePageSize });
    })();
  }, []);

  // @ts-ignore
  const onRegistration = async (event: Registered) => {
    try {
      Log('Device Token Received', event.deviceToken);
      const endpointParams = {
        PlatformApplicationArn: androidARN,
        Token: event.deviceToken,
      };
      //fetch credentials from Cognito to create the SNS endpoint
      AWS.config.update({ region: 'eu-west-3' });
      AWS.config.credentials = new AWS.CognitoIdentityCredentials(
        {
          IdentityPoolId: cognitoPool,
        },
        { region: 'eu-west-3' }
      );
      await AWS.config.credentials.getPromise();
      const endpointARN = await createARNAsync(endpointParams);
      if (!endpointARN) {
        throw new Error('error creating endpointARN');
      }
      Log('endpointARN:', endpointARN);
      //get endpoint attributes
      let attributes = await getAttributesAsync({
        EndpointArn: endpointARN,
      });
      Log('attributes:', attributes);
      //if token does not match current token
      //or the endpoint is disabled, throw an error
      // @ts-ignore
      if ((attributes && !attributes.Enabled) || attributes.Token !== event.deviceToken) {
        throw new Error('endpoint error');
      }
      //send the data to the backend
      //registerDevice(endpointARN, event.deviceToken);
    } catch (e) {
      //create the endpoint again and store it
      return 0;
    }
  };

  const createARNAsync = params =>
    new Promise((resolve, reject) => {
      const sns = new AWS.SNS();
      sns.createPlatformEndpoint(params, (err, data) => {
        console.log('created endpoint', err, data);
        if (err || !data.EndpointArn) {
          return err ? reject(err) : reject('arn is missing');
        }
        resolve(data.EndpointArn);
      });
    });
  const getAttributesAsync = params =>
    new Promise((resolve, reject) => {
      const sns = new AWS.SNS();
      sns.getEndpointAttributes(params, (err, data) => {
        console.log('got attrs:', err, data);
        if (err || !data.Attributes) {
          return err ? reject(err) : reject('attributes are missing in the response');
        }
        resolve(data.Attributes);
      });
    });

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='homeScreen' style={FULL}>
        <HeaderWithBalance
          balance={availableBalance}
          left={<Logo uri={uri} logoStyle={{ width: 50, height: 50 }} />}
          right={<Menu navigation={navigation} />}
        />
        <Screen preset='scroll' backgroundColor={palette.white}>
          <View style={{ padding: spacing[3] }}>
            <TransactionSummary
              currentMonthSummary={currentMonthSummary}
              accountHolder={currentAccountHolder}
              balance={availableBalance}
              currentYearSummary={transactionsSummary}
            />
          </View>
          <HomeLatestTransactions
            transactions={latestTransactions}
            onPress={() => navigation.navigate('transactionList')}
            loading={loadingTransactions}
            navigation={navigation}
          />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
