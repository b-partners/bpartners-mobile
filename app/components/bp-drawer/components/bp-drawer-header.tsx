import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerActions } from '@react-navigation/native';
import React, { FC } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { User } from '../../../models/entities/user/user';
import { color, spacing } from '../../../theme';
import { AutoImage } from '../../auto-image/auto-image';
import { Icon } from '../../icon/icon';

type BPDrawerHeaderProps = {
  currentUser: User;
  uri: string;
  navigation: DrawerNavigationHelpers;
};

export const BPDrawerHeader: FC<BPDrawerHeaderProps> = props => {
  const { currentUser, navigation, uri } = props;

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 3,
        width: '100%',
        height: '25%',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity style={{ position: 'absolute', top: 15, left: 20 }} onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
          <Icon icon='back' />
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <AutoImage
              source={currentUser?.logoFileId ? { uri } : require('../utils/profile-placeholder.png')}
              resizeMode='stretch'
              resizeMethod='auto'
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
              }}
            />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: Platform.select({ android: spacing[4], ios: spacing[2] }),
            }}
          >
            <Text
              style={{
                marginRight: spacing[1],
                textTransform: 'uppercase',
                color: color.palette.white,
                fontFamily: 'Geometria-Bold',
              }}
              testID='craftsmanFirstName'
            >
              {currentUser?.firstName}
            </Text>
            <Text
              style={{
                textTransform: 'uppercase',
                color: color.palette.white,
                fontFamily: 'Geometria',
              }}
              testID='craftsmanLastName'
            >
              {currentUser?.lastName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
