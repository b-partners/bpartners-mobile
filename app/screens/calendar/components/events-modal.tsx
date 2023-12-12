import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { Button } from '../../../components';
import { palette } from '../../../theme/palette';
import { SynchronizeModalProps } from '../utils/utils';

export const EventsModal = (props: SynchronizeModalProps) => {
  const { isOpen, setOpen } = props;

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={onClose}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(16, 16, 19, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '98%', height: '60%', backgroundColor: palette.white, borderRadius: 10 }}>
          <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
            <Button
              onPress={() => {
                setOpen(false);
              }}
              style={{
                backgroundColor: palette.white,
                position: 'absolute',
                right: 10,
                top: 10,
              }}
            >
              <CloseIcon name='close' size={25} color={palette.secondaryColor} />
            </Button>
          </View>
          <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
            <View
              style={{
                width: '96%',
                height: 80,
                borderRadius: 5,
                borderBottomWidth: 2,
                borderColor: palette.lighterGrey,
                backgroundColor: palette.blue,
              }}
            >
              <View style={{ height: '100%', width: '30%', backgroundColor: palette.white }}></View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
