import { palette } from '../../theme/palette';
import React from 'react';
import { Modal, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ReloadModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rotation: number;
}
export const ReloadModal = (props: ReloadModalProps) => {
  const { isOpen, setOpen, rotation } = props;

  return (
    <Modal animationType='fade' transparent={true} visible={isOpen} onRequestClose={() => setOpen(false)}>
      <View
        style={{
          width: '100%',
          height: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ height: 45, width: 45, backgroundColor: palette.solidGrey, borderRadius: 45 }}>
          <MaterialCommunityIcons
            name='refresh'
            size={40}
            color={palette.secondaryColor}
            style={[
              {
                alignSelf: 'center',
              },
              { transform: [{ rotate: `${rotation}deg` }] },
            ]}
          />
        </View>
      </View>
    </Modal>
  );
};
