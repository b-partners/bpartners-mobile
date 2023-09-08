import React, { useState } from 'react';
import { FlatList, Modal, Platform, TouchableOpacity, View } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Separator, Text } from '../../../components';
import KeyboardAvoidingWrapper from '../../../components/keyboard-avoiding-wrapper/keyboard-avoiding-wrapper';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { BusinessActivityItem } from '../../../models/entities/business-activity/business-activity';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export type BusinessActivityModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  businessActivities: BusinessActivityItem[];
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

export const BusinessActivityModal: React.FC<BusinessActivityModalProps> = props => {
  const { showModal, setShowModal, businessActivities, onChange } = props;

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  return (
    <KeyboardAvoidingWrapper>
      <Modal visible={showModal} animationType='fade' transparent={true} onRequestClose={() => setShowModal(false)}>
        <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(10, 16, 69, 0.5)',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <View
              style={[
                {
                  padding: spacing[4],
                  backgroundColor: palette.white,
                  width: '100%',
                },
                keyboardOpen && Platform.OS === 'android' ? { height: '90%' } : { height: '60%' },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: spacing[1], paddingHorizontal: spacing[2], height: '5%' }}>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
                </TouchableOpacity>
              </View>
              <View style={{ paddingVertical: spacing[2], height: '90%' }}>
                <FlatList
                  data={businessActivities}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => {
                    return (
                      <View style={{ width: '100%', flexDirection: 'row', paddingVertical: spacing[2], height: 40 }}>
                        <TouchableOpacity
                          style={{ width: '100%', flexDirection: 'row' }}
                          onPress={() => {
                            onChange(item.name);
                            setShowModal(false);
                          }}
                        >
                          <>
                            <View style={{ width: '65%', height: '100%' }}>
                              <Text
                                text={item.name}
                                style={{
                                  color: palette.lightGrey,
                                  fontSize: 15,
                                  marginLeft: spacing[2],
                                  width: '100%',
                                }}
                                numberOfLines={2}
                              />
                            </View>
                            <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: spacing[2] }}></View>
                          </>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
                />
              </View>
            </View>
          </View>
        </KeyboardLayout>
      </Modal>
    </KeyboardAvoidingWrapper>
  );
};
