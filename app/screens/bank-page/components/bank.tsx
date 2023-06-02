import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useStores } from '../../../models';
import { BankInfo } from '../../../models/entities/bank/bank-info';

/*import AccountBalanceIcon from 'path/to/AccountBalanceIcon'; // Replace with the correct path
import BankDisconnection from './BankDisconnection'; // Replace with the correct path
import BankInformationForm from './BankInformationForm'; // Replace with the correct path*/
type BankInfosProps = {
  bank: BankInfo;
};

export const Bank: React.FC<BankInfosProps> = props => {
  const { bank } = props;

  // const [isDialogOpen, setDialogState] = useState(false);

  const { bankInfo, authStore } = useStores();

  const { currentUser } = authStore;

  useEffect(() => {
    bankInfo.fetchBankInfo(currentUser.id);
    __DEV__ && console.tron.log('now, Bank Info', bankInfo.bankInformation);
  }, []);

  /*const handleCloseDialog = () => setDialogState(false);*/
  // const handleOpenDialog = () => setDialogState(true);

  return (
    <>
      {/*<BankDisconnection setAccount={setAccount} isOpen={isDialogOpen} onClose={handleCloseDialog} bank={account.bank} />*/}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{bank.name}</Text>
          <TouchableOpacity style={styles.disconnectButton} >
            {/*<Image source={AccountBalanceIcon} style={styles.buttonIcon} />*/}
            <Text style={styles.buttonLabel}>Déconnecter ma banque</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.rowContainer}>
            <View style={styles.bankCard}>
              {/*<Image source={{ uri: account.bank.logoUrl }} style={styles.bankLogo} resizeMode='contain' />*/}
              {/*<Text style={styles.bankName}>{account.bank.name}</Text>*/}
              <View style={styles.bankDetails}>
                {/* <BankCardText label={account.name} title='Nom du compte' />
                                <BankCardText label={account.bic} title='BIC' />
                                <BankCardText label={account.iban} title='IBAN' />*/}
              </View>
            </View>
            {/*<BankInformationForm setAccount={setAccount} account={account} />*/}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  cardContent: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankCard: {
    width: 440,
    height: 300,
    paddingLeft: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  bankLogo: {
    position: 'absolute',
    top: 24,
    right: 0,
    borderRadius: 10,
    height: 80,
    width: 80,
  },
  bankName: {
    marginTop: 8,
    fontSize: 18,
  },
  bankDetails: {
    // Define your styles for bank details
  },
});
