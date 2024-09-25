import React, { useEffect, useState } from 'react';
import { ScrollView, TextStyle, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { LabelWithTextColumn, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Account, AccountInfos } from '../../../models/entities/account/account';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { ErrorBoundary } from '../../error/error-boundary';
import { Logo } from '../../home/components/logo';
import { getCurrentAccount, getCurrentAccountInfo } from '../utils/get-current-account';
import AccountConfig from './account-config';
import { BankEditionModal } from './bank-edition-modal';
import { BankDisconnectionModal } from './disconnection-modal';

export const Bank: React.FC = () => {
  const { authStore } = useStores();
  const { currentAccount } = authStore;

  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountList, setAccountList] = useState<Account[]>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [accountInfo, setAccountInfo] = useState<AccountInfos>();

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const accounts = await authStore.getAccountList();
        if (!isCancelled) {
          setAccountList(accounts);
          setSelectedAccount(getCurrentAccount(accounts));
          setAccountInfo(getCurrentAccountInfo(accounts));
        }
      } catch {
        if (!isCancelled) {
          showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
          setShowModal(false);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [showModal]);

  const CONTAINER_STYLE: TextStyle = {
    width: '90.5%',
    height: 300,
    backgroundColor: palette.solidGrey,
    marginHorizontal: '5%',
    marginTop: '5%',
    borderRadius: 10,
    flexDirection: 'column',
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <ErrorBoundary catchErrors='always'>
          <View style={{ flex: 1, width: '100%', height: '100%', flexDirection: 'column' }}>
            {loading && <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} style={{ marginTop: spacing[2] }} />}
            <View style={CONTAINER_STYLE}>
              <View style={{ width: '100%', height: 70, marginTop: 20, flexDirection: 'row' }}>
                <View
                  style={{
                    width: '70%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontFamily: 'Geometria',
                      color: palette.black,
                      width: '100%',
                      height: 50,
                      alignItems: 'center',
                      padding: spacing[3],
                    }}
                  >
                    {currentAccount?.bank?.name}
                  </Text>
                </View>
                <View
                  style={{
                    width: '30%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                >
                  <Logo uri={currentAccount?.bank?.logoUrl} logoStyle={{ width: 140, height: 70 }} testID={'logoBank'} />
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  marginTop: 15,
                  flexDirection: 'column',
                  marginBottom: 10,
                }}
              >
                <LabelWithTextColumn label='bankScreen.accountName' text={accountInfo?.name} />
                <LabelWithTextColumn label='bankScreen.bic' text={accountInfo?.bic} />
                <LabelWithTextColumn label='bankScreen.iban' text={accountInfo?.iban} />
              </View>
            </View>
            <TouchableOpacity
              style={{
                position: 'relative',
                backgroundColor: palette.secondaryColor,
                width: '90%',
                height: 40,
                alignSelf: 'center',
                borderRadius: 10,
                justifyContent: 'center',
                flexDirection: 'row',
                borderWidth: 1,
                marginTop: spacing[2],
                borderColor: palette.secondaryColor,
              }}
              onPress={() => setShowModal(true)}
            >
              <View style={{ justifyContent: 'center', marginRight: 8 }}>
                <IoniconIcon name='ios-pencil' size={22} color={color.palette.white} />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: color.palette.white,
                    fontFamily: 'Geometria',
                  }}
                >
                  {translate('common.edit')}
                </Text>
              </View>
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  ...CONTAINER_STYLE,
                  marginTop: spacing[5],
                  color: palette.black,
                  height: 50,
                  textAlign: 'center',
                  paddingVertical: spacing[3],
                }}
                tx={'bankScreen.changeIncomingAccount'}
              />
            </View>
            <AccountConfig
              accountList={accountList}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              setAccountInfo={setAccountInfo}
            />
            <TouchableOpacity
              style={{
                position: 'relative',
                backgroundColor: palette.secondaryColor,
                width: '90%',
                height: 40,
                alignSelf: 'center',
                borderRadius: 10,
                justifyContent: 'center',
                marginVertical: spacing[5],
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: palette.secondaryColor,
              }}
              onPress={() => setConfirmationModal(true)}
            >
              <View style={{ justifyContent: 'center', marginRight: 8 }}>
                <MaterialCommunityIcon name='bank-outline' size={22} color={color.palette.white} />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: color.palette.white,
                    fontFamily: 'Geometria',
                  }}
                >
                  {translate('bankScreen.logout')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {showModal && <BankEditionModal showModal={showModal} setShowModal={setShowModal} accountInfo={accountInfo} setAccountInfo={setAccountInfo} />}
          {confirmationModal && (
            <BankDisconnectionModal
              confirmationModal={confirmationModal}
              setConfirmationModal={setConfirmationModal}
              currentAccount={currentAccount}
              setAccountInfo={setAccountInfo}
            />
          )}
        </ErrorBoundary>
      </View>
    </ScrollView>
  );
};
