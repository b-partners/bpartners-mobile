import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useStores } from '../../models';
import { color } from '../../theme';
import { palette } from '../../theme/palette';

export const NoBank = () => {
  const { bankStore, authStore } = useStores();

  const { currentUser, currentAccount } = authStore;

  const initiateBankConnection = () => {
    const fetch = async () => {
      await bankStore.connectToBank(currentUser.id, currentAccount.id);
    };
    fetch().catch();
  };

  return (
    <View>
      <MaterialCommunityIcon name='bank-outline' size={400} color={color.palette.secondaryColor} />
      <Text style={styles.titleText}>Aucune banque associée</Text>
      <Text style={styles.text}>
        Cliquez{' '}
        <Text style={styles.linkText} onPress={initiateBankConnection}>
          ici
        </Text>{' '}
        pour associer une banque
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: '5%',
  },
  linkText: {
    color: palette.secondaryColor,
  },
});