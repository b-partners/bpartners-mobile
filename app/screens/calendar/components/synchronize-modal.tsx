import React, { useState } from 'react';
import { Linking, Modal, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { AutoImage, Button, ScrollingText, Text } from '../../../components';
import { TEXT_STYLE } from '../../../components/bp-drawer/utils/styles';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SynchronizeModalProps } from '../utils/utils';

export const SynchronizeModal = (props: SynchronizeModalProps) => {
  const { isOpen, setOpen } = props;
  const { calendarStore } = useStores();
  const [isChecked, setChecked] = useState(false);

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
            <View
              style={{
                marginTop: spacing[4],
                marginBottom: spacing[2],
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <View style={{ marginHorizontal: spacing[1] }}>
                <Checkbox.Android
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked(!isChecked);
                  }}
                  color={palette.secondaryColor}
                  uncheckedColor={palette.greyDarker}
                />
              </View>
              <ScrollingText text={translate('calendarScreen.firstText')} containerWidth={1500} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 12, fontFamily: 'Geometria', color: palette.greyDarker }} tx={'calendarScreen.secondText'} />
              <Text
                style={{ fontSize: 12, fontFamily: 'Geometria', color: palette.textClassicColor, textDecorationLine: 'underline' }}
                text={'https://legal.bpartners.app/'}
                onPress={() => Linking.openURL('https://legal.bpartners.app/')}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: spacing[6] }}>
              {isChecked ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: palette.secondaryColor,
                    width: 200,
                    height: 35,
                    bottom: '3%',
                    alignSelf: 'center',
                    borderRadius: 5,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={async () => {
                    onClose();
                    await calendarStore.initiateConsent();
                  }}
                >
                  <View style={{ flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                    <Text
                      tx={'calendarScreen.sync'}
                      style={{
                        ...TEXT_STYLE,
                        color: palette.white,
                        fontFamily: 'Geometria',
                      }}
                    />
                    <MaterialIcon name='sync' size={22} color={palette.white} />
                  </View>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    backgroundColor: palette.lighterGrey,
                    width: 200,
                    height: 35,
                    bottom: '3%',
                    alignSelf: 'center',
                    borderRadius: 5,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                    <Text
                      tx={'calendarScreen.sync'}
                      style={{
                        ...TEXT_STYLE,
                        color: palette.white,
                        fontFamily: 'Geometria',
                      }}
                    />
                    <MaterialIcon name='sync' size={22} color={palette.white} />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
