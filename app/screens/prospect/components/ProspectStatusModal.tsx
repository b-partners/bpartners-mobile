import { ProspectStatus } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { View } from 'react-native';
import { ButtonProps, Button as RNPButton } from 'react-native-paper';

import { MenuItem, Text } from '../../../components';
import { TxKeyPath, translate } from '../../../i18n';
import { palette } from '../../../theme/palette';
import { prospectStatusModalStyle as styles } from './style';

const Button: FC<Omit<ButtonProps, 'children'> & { tx?: TxKeyPath; text?: string }> = ({ tx, text, ...props }) => {
  return (
    <RNPButton {...props} buttonColor={palette.secondaryColor} textColor={palette.white} compact={true}>
      {tx ? translate(tx) : text}
    </RNPButton>
  );
};

interface ProspectStatusModalProps {
  menuItems: MenuItem[];
  setStatus: (value: any) => void;
  onEditing: () => void;
}

export const ProspectStatusModal: FC<ProspectStatusModalProps> = ({ menuItems, onEditing, setStatus }) => {
  return (
    <View style={styles.container}>
      <Text tx='prospectScreen.process.onProspectChangingStatus' style={styles.title} />
      {menuItems.map(item => (
        <Button key={item.id} onPress={() => setStatus(ProspectStatus[item.label])} text={item.title} />
      ))}
      <View style={styles.orContainer}>
        <View style={styles.separator} />
        <View>
          <Text style={styles.or} tx='common.or' />
        </View>
        <View style={styles.separator} />
      </View>
      <Button onPress={onEditing} tx='prospectScreen.process.editProspect' />
    </View>
  );
};
