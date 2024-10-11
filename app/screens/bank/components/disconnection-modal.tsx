import React, { useState } from 'react';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';

import { Button, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Account, AccountInfos } from '../../../models/entities/account/account';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { SHADOW_STYLE } from '../../invoices/utils/styles';

type BankModalProps = {
  confirmationModal: boolean;
  setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfos>>;
  currentAccount: Account;
};

export const BankDisconnectionModal: React.FC<BankModalProps> = props => {
  const { confirmationModal, setConfirmationModal, currentAccount, setAccountInfo } = props;

  const [isLoading, setIsLoading] = useState(false);

  const { authStore } = useStores();
  const disconnectBank = async () => {
    setIsLoading(true);
    try {
      const account = await authStore.disconnectBank();
      setAccountInfo(account);
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={confirmationModal}
      onDismiss={() => setConfirmationModal(false)}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: color.palette.white,
          borderRadius: 20,
          width: '94%',
          minWidth: '94%',
          height: 250,
        }}
      >
        <Text
          style={{
            paddingTop: spacing[5],
            color: palette.black,
            fontSize: 20,
            textAlign: 'center',
          }}
          tx={'bankScreen.disconnectionModal.confirm'}
        />
        <View
          style={{
            marginVertical: spacing[5],
          }}
        >
          <Text
            style={{
              color: palette.black,
              fontSize: 16,
              textAlign: 'center',
            }}
            tx={'bankScreen.disconnectionModal.confirmationPhrase'}
          />
          <Text
            style={{
              paddingTop: spacing[2],
              color: palette.black,
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
            }}
            text={`${currentAccount?.bank?.name} ?`}
          />
        </View>
        <View
          style={{
            marginVertical: spacing[5],
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '80%',
            minWidth: '80%',
            alignSelf: 'center',
          }}
        >
          <Button
            tx={'bankScreen.disconnectionModal.disconnect'}
            style={{
              ...SHADOW_STYLE,
              backgroundColor: palette.secondaryColor,
              borderRadius: 5,
              paddingVertical: spacing[1],
              paddingHorizontal: spacing[2],
              width: 150,
              height: 40,
            }}
            onPress={disconnectBank}
            textStyle={{ fontSize: 16 }}
          >
            {isLoading && <Loader size={22} color={palette.white} />}
          </Button>
          <Button
            tx={'common.cancel'}
            style={{
              ...SHADOW_STYLE,
              backgroundColor: palette.secondaryColor,
              borderRadius: 5,
              paddingVertical: spacing[1],
              paddingHorizontal: spacing[2],
              width: 100,
              height: 40,
            }}
            onPress={() => setConfirmationModal(false)}
            textStyle={{ fontSize: 16 }}
          />
        </View>
      </View>
    </Modal>
  );
};
