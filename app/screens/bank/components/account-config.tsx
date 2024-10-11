import React, { FC, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Icon, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Account, AccountInfos } from '../../../models/entities/account/account';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { CustomerFormFieldFooter } from '../../invoice-form/components/customer/customer-form-field-footer';
import { BankSelectionField } from './bank-selection-field';

type TAccountConfigProps = {
  accountList: Account[];
  selectedAccount: Account;
  setSelectedAccount: React.Dispatch<React.SetStateAction<Account>>;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfos>>;
};

const AccountConfig: FC<TAccountConfigProps> = props => {
  const { authStore } = useStores();
  const { accountList, selectedAccount, setSelectedAccount, setAccountInfo } = props;
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onActivateAccount = async () => {
    setIsLoading(true);
    try {
      await authStore.setActiveAccount(selectedAccount?.id);
      setAccountInfo(selectedAccount);
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    } finally {
      setIsLoading(false);
    }
  };
  const showVisible = visible => {
    visible && setIsDisable(false);
  };

  return (
    <>
      <BankSelectionField
        accounts={accountList}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        onValueChange={newValue => setSelectedAccount(newValue)}
        labelTx='bankScreen.myAccount'
        modalTx='bankScreen.accountSelection'
        placeholderTx='invoiceScreen.labels.customerSectionPlaceholder'
        items={accountList}
        itemLabel='name'
        itemValue='id'
        itemSuffix={<Icon icon='edit' />}
        itemSuffixAction={() => {}}
        footer={<CustomerFormFieldFooter />}
        selectContainerStyle={{
          paddingHorizontal: spacing[4],
          width: '90%',
          alignSelf: 'center',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: palette.lighterGrey,
          backgroundColor: palette.solidGrey,
          marginVertical: spacing[2],
        }}
        showVisible={showVisible}
      />
      {isDisable ? (
        <View
          style={{
            position: 'relative',
            backgroundColor: palette.lighterGrey,
            width: '90%',
            height: 40,
            alignSelf: 'center',
            borderRadius: 10,
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: palette.lighterGrey,
          }}
        >
          <View style={{ justifyContent: 'center', marginRight: 8 }}>
            <MaterialCommunityIcons name='zip-disk' size={22} color={color.palette.greyDarker} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                color: color.palette.greyDarker,
                fontFamily: 'Geometria',
              }}
            >
              {translate('common.register')}
            </Text>
          </View>
        </View>
      ) : (
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
            borderColor: palette.secondaryColor,
          }}
          onPress={onActivateAccount}
        >
          <View style={{ justifyContent: 'center', marginRight: 8 }}>
            {isLoading ? <Loader size={22} color={palette.white} /> : <MaterialCommunityIcons name='zip-disk' size={22} color={color.palette.white} />}
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                color: color.palette.white,
                fontFamily: 'Geometria',
              }}
            >
              {translate('common.register')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default AccountConfig;
