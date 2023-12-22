import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text as SolidText } from '../../../components/text/text';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';

export const NoBank = () => {
  //const { bankStore, authStore } = useStores();

  // const { currentUser, currentAccount } = authStore;

  /*{
    const initiateBankConnection = () => {
      const fetch = async () => {
        await bankStore.connectToBank(currentUser.id, currentAccount.id);
      };
      fetch().catch();
    };
  }*/

  return (
    <View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <View
        style={{
          width: '90%',
          height: 320,
          backgroundColor: palette.solidGrey,
          marginHorizontal: '5%',
          marginTop: '25%',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: palette.secondaryColor,
        }}
      >
        <MaterialCommunityIcon name='bank-outline' size={200} color={color.palette.secondaryColor} />
        <SolidText tx={'bankScreen.noBank'} style={{ fontSize: 25, fontFamily: 'Geometria', color: palette.lightGrey, alignSelf: 'center', marginTop: 10 }} />
      </View>
      {/*
        <TouchableOpacity
          style={{
            position: 'relative',
            backgroundColor: palette.white,
            width: '90%',
            height: 40,
            marginTop: 50,
            alignSelf: 'center',
            borderRadius: 40,
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: palette.secondaryColor,
          }}
          onPress={initiateBankConnection}
        >
          <View style={{ justifyContent: 'center', marginRight: 8 }}>
            <MaterialCommunityIcon name='bank-outline' size={22} color={color.palette.secondaryColor} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                color: color.palette.secondaryColor,
                fontFamily: 'Geometria',
              }}
            >
              {translate('bankScreen.associate')}
            </Text>
          </View>
        </TouchableOpacity>
      */}
    </View>
  );
};
