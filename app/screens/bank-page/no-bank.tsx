import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { color } from '../../theme';

const NoBank = () => {
  /*const [isLoading, setLoading] = useState(false);
    const initiateBankConnectionAsync = () => {
        const fetch = async () => {
            setLoading(true);
            const redirectionUrl = await initiateBankConnection();
            redirect(redirectionUrl.redirectionUrl);
        };
        fetch().catch(printError);
    };*/

  return (
    <View>
      <MaterialCommunityIcon name='bank-outline' size={400} color={color.palette.secondaryColor} />
      <Text style={styles.titleText}>Page en cours de construction!</Text>
      {/*<Text style={styles.text}>Cliquez ici pour associer une banque</Text>*/}
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
    fontSize: 14,
    textAlign: 'center',
    marginTop: '5%',
  },
});

export default NoBank;
