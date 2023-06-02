import React from 'react';
import { View } from 'react-native';

import { LabelWithTextColumn } from '../../../components';
import { Text } from '../../../components/text/text';
import { Account } from '../../../models/entities/account/account';
import { palette } from '../../../theme/palette';
import { Logo } from '../../home/home-screen';

type BankInfosProps = {
  currentAccount: Account;
};

export const Bank: React.FC<BankInfosProps> = props => {
  const { currentAccount } = props;

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <View
        style={{
          width: '90%',
          height: 400,
          backgroundColor: palette.solidGrey,
          marginHorizontal: '5%',
          marginTop: 20,
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
        <View style={{ width: '100%', flex: 1, marginTop: 5, flexDirection: 'column', marginBottom: 10}}>
          <LabelWithTextColumn label='bankScreen.accountName' text={currentAccount.name} />
          <LabelWithTextColumn label='bankScreen.bic' text={currentAccount.bic} />
          <LabelWithTextColumn label='bankScreen.iban' text={currentAccount.iban} />
        </View>
      </View>
    </View>
  );
};
