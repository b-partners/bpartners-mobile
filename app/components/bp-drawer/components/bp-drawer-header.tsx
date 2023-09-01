import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
// import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { User } from '../../../models/entities/user/user';
import { color, spacing } from '../../../theme';
import { AutoImage } from '../../auto-image/auto-image';
import { Icon } from '../../icon/icon';

export function BPDrawerHeader(props: {
  onPress: () => void;
  currentUser: User;
  uri: string;
  onChangeText: (value: string) => void;
  navigation: DrawerNavigationHelpers;
}) {
  const { currentUser, navigation, uri } = props;

  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 3,
        width: '100%',
        height: '25%',
        paddingTop: Platform.select({ ios: top - 30, android: 0 }),
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: spacing[5],
          paddingVertical: spacing[6],
        }}
      >
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
          <Icon icon='back' />
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View>
            {/*<TouchableOpacity style={{
              position: "absolute",
              bottom: -10,
              left: 21,
              zIndex: 1
            }}>{<Icon icon='edit' />}</TouchableOpacity>*/}
            <AutoImage source={currentUser?.logoFileId ? { uri } : require('../utils/profile-placeholder.png')} resizeMode='stretch' resizeMethod='auto' />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: Platform.select({ android: spacing[7] - 10, ios: spacing[6] }),
            }}
          >
            <Text
              style={{
                marginRight: spacing[1],
                textTransform: 'uppercase',
                color: color.palette.white,
                fontFamily: 'Geometria-Bold',
              }}
            >
              {currentUser?.firstName}
            </Text>
            <Text
              style={{
                textTransform: 'uppercase',
                color: color.palette.white,
                fontFamily: 'Geometria',
              }}
            >
              {currentUser?.lastName}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          {/*<Icon icon='redBullet' style={{ position: 'absolute', top: 0, left: 0 }} />*/}
          {/*<Icon icon='bell' />*/}
        </TouchableOpacity>
      </View>
      {/*<View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'absolute',
          bottom: -20,
          left: '25%',
          right: '25%',
          zIndex: 10,
        }}
      >
        <View
          style={{
            backgroundColor: color.palette.white,
            borderRadius: 50,
            width: 350,
            height: 50,
            paddingHorizontal: spacing[4],
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#9C255A',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}
        >
          <Icon icon='magnifier' />
          <TextInput style={{ width: '100%', height: '100%', paddingHorizontal: spacing[4] }} />
        </View>
      </View>*/}
    </View>
  );
}
