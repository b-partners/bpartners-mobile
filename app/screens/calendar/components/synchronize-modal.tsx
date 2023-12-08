import React from 'react';
import { Linking, Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { AutoImage, Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SynchronizeModalProps } from '../utils/utils';
import { ScrollingText } from './scrolling-text';

export const SynchronizeModal = (props: SynchronizeModalProps) => {
  const { isOpen, setOpen } = props;

  const onClose = () => {
    setOpen(false);
  };

  const containerWidth = 1300;
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
        <View style={{ width: '98%', height: 300, backgroundColor: palette.white, borderRadius: 10 }}>
          <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <AutoImage
              source={require('../utils/google-calendar.png')}
              resizeMode='stretch'
              resizeMethod='auto'
              style={{
                width: 70,
                height: 70,
              }}
            />
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
          <View style={{ width: '100%', height: 150, alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontFamily: 'Geometria', color: palette.textClassicColor }} tx={'calendarScreen.firstLabel'} />
            <Text style={{ fontSize: 15, fontFamily: 'Geometria', color: palette.textClassicColor }} tx={'calendarScreen.secondLabel'} />
            <Text style={{ fontSize: 15, fontFamily: 'Geometria', color: palette.textClassicColor }} tx={'calendarScreen.thirdLabel'} />
            <View style={{ marginVertical: spacing[4] }}>
              <ScrollingText text={translate('calendarScreen.firstText')} containerWidth={containerWidth} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 12, fontFamily: 'Geometria', color: palette.greyDarker }} tx={'calendarScreen.secondText'} />
              <Text
                style={{ fontSize: 12, fontFamily: 'Geometria', color: palette.textClassicColor, textDecorationLine: 'underline' }}
                text={'https://legal.bpartners.app/'}
                onPress={() => Linking.openURL('https://legal.bpartners.app/')}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
