import React from 'react';
import { TouchableOpacity, View } from 'react-native';
//import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { LabelWithTextColumn } from '../../../components';
import { Text } from '../../../components/text/text';
import { translate } from '../../../i18n';
import { Account } from '../../../models/entities/account/account';
import { palette } from '../../../theme/palette';
import { Logo } from '../../home/home-screen';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import {color} from "../../../theme";

type BankInfosProps = {
  currentAccount: Account;
};

export const Bank: React.FC<BankInfosProps> = props => {
  const { currentAccount } = props;

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
          flexDirection: 'column',
        }}
      >
        <View style={{ width: '100%', height: 70, marginTop: 20, flexDirection: 'row' }}>
          <View style={{ width: '70%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 32, fontFamily: 'Geometria', color: palette.black }}>{currentAccount.bank.name}</Text>
          </View>
          <View style={{ width: '30%', height: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Logo uri={currentAccount.bank.logoUrl} logoStyle={{ width: 140, height: 70 }} />
          </View>
        </View>
        <View style={{ width: '100%', flex: 1, marginTop: 20, flexDirection: 'column', marginBottom: 10 }}>
          <LabelWithTextColumn label='bankScreen.accountName' text={currentAccount.name} />
          <LabelWithTextColumn label='bankScreen.bic' text={currentAccount.bic} />
          <LabelWithTextColumn label='bankScreen.iban' text={currentAccount.iban} />
        </View>
      </View>
        <TouchableOpacity
        style={{
          position: 'relative',
          backgroundColor: palette.white,
          width: '70%',
          height: 40,
          marginTop: 30,
          alignSelf: 'center',
          borderRadius: 40,
          justifyContent: 'center',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: palette.secondaryColor,
        }}
      >
        <View style={{ justifyContent: 'center', marginRight: 8 }}>
            <IoniconIcon name='ios-pencil' size={22} color={color.palette.secondaryColor} />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: 16,
              color: color.palette.secondaryColor,
              fontFamily: 'Geometria',
            }}
          >
            {translate('common.edit')}
          </Text>
        </View>
      </TouchableOpacity>
        {/*<TouchableOpacity
        style={{
          position: 'relative',
          backgroundColor: palette.white,
          width: '90%',
          height: 40,
          marginTop: 30,
          alignSelf: 'center',
          borderRadius: 40,
          justifyContent: 'center',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: palette.secondaryColor,
        }}
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
            {translate('bankScreen.logout')}
          </Text>
        </View>
      </TouchableOpacity>*/}
    </View>
  );
};
